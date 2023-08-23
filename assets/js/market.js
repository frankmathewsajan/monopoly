function updateCostPrimary(plotcode) {
    var k = data.plot[plotcode - 1] += data.addlist[plotcode - 1];
    alert("Rent of Plot " + plotcode + " is updated to " + k);
    addtoHistory("Plot " + plotcode, "Rent Updated to " + k);
    localRefresh()
}


function makeOwner(buyer_name, plotcode) {
    data.plots.push(plotcode);
    data[buyer_name + "owns"].push(plotcode)
    localRefresh()
}

function rent(plotcode, buyer) {
    var plotcode = Validate(Number(prompt("Rent\nEnter Plot Code", plotcode)), 23);
    if (getStatus(plotcode).bought && plotcode) {
        var buyer = Validate(Number(prompt("Rent\nWho is paying the rent for Plot " + plotcode + " ?", buyer)), 5);

        if (buyer) {
            var buyer_name = id_to_name(buyer);
            if (getStatus(plotcode).owner == buyer_name) {
                alert("You own this plot");
                updateCost(plotcode);
            } else {
                var rent = getStatus(plotcode).rent;
                updateCost(plotcode);
                Sub(rent, buyer_name);
                Add(rent, getStatus(plotcode).owner);
                addtoHistory(buyer_name, "+$" + rent + " for plot " + plotcode + " -> " + getStatus(plotcode).owner);
            }
        }

    } else {
        buy(plotcode, buyer)
    }

}


function updateCost(plotcode) {
    debugger
    const { rent, mval, sub } = getStatus(plotcode);
    let x2 = Math.min(rent * 2 - sub, mval);
    data.plot[plotcode - 1] = x2;
    data.sublist[plotcode - 1] = parseInt((100 + sub) / 10);
    alert(`Rent of Plot ${plotcode} is updated to ${x2}`);
    addtoHistory(`Plot ${plotcode}`, `Rent -> ${x2}`);
    localRefresh();
}

function buy(plotcode, buyer) {
    plotcode = Validate(Number(prompt("Buy\nEnter Plot Code", plotcode)), 23);
    buyer = Validate(Number(prompt("Buy\nWho is buying the Plot " + plotcode + " ?", buyer)), 5);
    let status = getStatus(plotcode);
    if (plotcode && !status.bought) {
        let buyer_name = id_to_name(buyer);
        if (status.owner === buyer_name) {
            alert("You own this plot");
            updateCost(plotcode);
        } else {
            Sub(status.rent, buyer_name);
            updateCostPrimary(plotcode);
            addtoHistory(buyer_name, `Bought Plot ${plotcode} -${status.rent}`);
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
                    updateCost(plot)
                });
                addtoHistory(JSON.stringify(status.set), `Entire color set sold out : lvl +1`);
            }
            if (status.set.length == owned) {
                status.set.forEach(plot => {
                    updateCost(plot)
                });
                addtoHistory(buyer_name, `Got entire color : lvl +2`);
            }
        }
    } else {
        rent(plotcode, buyer);
    }
}






function dice() {
    a = id_to_name(Validate((Number(prompt("Card Draw\nEnter UserID"))), 5));
    var items = [1, 2];
    var k = items[Math.floor(Math.random() * items.length)];
    if (k == 1) {
        Add(200, a);
        addtoHistory(a, "Gained $200 using Random Claim");
    } else {
        Sub(100, a);
        addtoHistory(a, "Lost $100 using Random Claim");
    }
}