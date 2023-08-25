


function makeOwner(buyer_name, plotcode) {
    data.plots.push(plotcode);
    data[buyer_name + "owns"].push(plotcode)
    localRefresh()
}

function rent(plotcode, rent_payer) {
    var rent_payer = Validate(Number(prompt("Rent\nWho is paying the rent for Plot " + plotcode + " ?", rent_payer)), 5);
    if (rent_payer) {
        var rent_payer_name = id_to_name(rent_payer);
        if (getStatus(plotcode).owner == rent_payer_name) {
            alert("You own this plot");
            updateCost(plotcode);
        } else {
            var rent = getStatus(plotcode).rent;
            updateCost(plotcode);
            const response = Sub(rent, rent_payer_name, [1, getStatus(plotcode).owner]);
            if (response == 200) {
                Add(rent, getStatus(plotcode).owner);
                addtoHistory(rent_payer_name, "+$" + rent + " for plot " + plotcode + " -> " + getStatus(plotcode).owner);
            }
        }
    }
}


function updateCost(plotcode,force = 1) {
    if (data.lvl[plotcode - 1] <= 3) {
        data.lvl[plotcode - 1] += 1;
        
        if (force === 1) {
            alert(`Rent of Plot ${plotcode} is updated to ${getStatus(plotcode).rent} : Level ${data.lvl[plotcode - 1] + 1}`);
        }
        addtoHistory(`Plot ${plotcode}`, `Rent -> ${getStatus(plotcode).rent} : Level ${data.lvl[plotcode - 1] + 1}`);

    }
    localRefresh();
}
function degradeCost(plotcode,force = 1) {
    if (data.lvl[plotcode - 1] >= 1) {
        data.lvl[plotcode - 1] -= 1;
        
        if (force === 1) {
            alert(`Rent of Plot ${plotcode} is degraded to ${getStatus(plotcode).rent} : Level ${data.lvl[plotcode - 1] + 1}`);
        }
        addtoHistory(`Plot ${plotcode}`, `Rent -> ${getStatus(plotcode).rent} : Level ${data.lvl[plotcode - 1] + 1}`);

    }
    localRefresh();
}



function property(plotcode,force=0) {
    var plotcode = force === 0 ? Validate(Number(prompt("Property\nEnter Plot Code"),plotcode), 23):plotcode
    let status = getStatus(plotcode);
    if (plotcode && !status.bought) {
        buy(plotcode)
    } else if (plotcode) {
        rent(plotcode);
    }
}

function buy(plotcode, buyer, force = 0, cost) {
    var buyer = force === 0 ? Validate(Number(prompt("Buy\nWho is buying the Plot " + plotcode + " ?", buyer)), 5) : buyer
    if (buyer) {
        let status = getStatus(plotcode);
        let buyer_name = id_to_name(buyer);

        let the_cost = force === 0 ? status.cost : cost;
        Sub(the_cost, buyer_name);
        updateCost(plotcode)
        addtoHistory(buyer_name, `Bought Plot ${plotcode} -${the_cost}`);
        makeOwner(buyer_name, plotcode);
        let bought = 0
        let owned = 0
        status.set.forEach(plot => {
            if (data.plots.includes(plot)) {
                bought++
            }
            if (getStatus(plot).owner == buyer_name) {
                owned++
            }
        });
        if (status.set.length == bought) {

            status.set.forEach(plot => {
                updateCost(plot,0)
            });
            addtoHistory(JSON.stringify(status.set), `Entire color set sold out : lvl +1`);
        }
        if (status.set.length == owned) {
            status.set.forEach(plot => {
                updateCost(plot,0)
            });
            addtoHistory(buyer_name, `Got entire color : lvl +2`);
        }
    }

}

let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let act = params.get('act');

if (act !== null) {
    act = JSON.parse(act);
    const [user, plot, currency] = act;
    if (!getStatus(plot).bought) {
        buy(plot, user, 1, currency);
    } else {
        location.replace('/')
    }
}

function pick() {
    document.getElementById('select_stuff').value = Math.ceil(Math.random() * Object.keys(events).length) - 1
    dice()
}

function dice() {
    
    const eve = Object.keys(events)[Number(document.getElementById("select_stuff").value)]
    events[eve].fn(eve)
}

