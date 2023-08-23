let data = {}


function ResetGame(p = 0) {
    if (p == 1 || confirm("Reset the Whole Game?")) {
        data = {
            car: 1500,
            ship: 1500,
            helicopter: 1500,
            plane: 1500,
            resume: false,
            history: 'Server Started &nbsp;<i class="fa fa-database" aria-hidden="true"></i><br>',
            plot: [60, 60, 100, 100, 120, 140, 140, 160, 180, 180, 200, 220, 220, 240, 260, 260, 280, 300, 300, 320, 350, 400],

            base: [60, 60, 100, 100, 120, 140, 140, 160, 180, 180, 200, 220, 220, 240, 260, 260, 280, 300, 300, 320, 350, 400],
            subbase: [10, 10, 20, 20, 40, 40, 40, 60, 70, 70, 90, 90, 90, 110, 120, 120, 140, 140, 140, 160, 180, 200],

            auctionplot: [],
            plots: [],
            carowns: [],
            shipowns: [],
            planeowns: [],
            helicopterowns: [],
            plotmax: [],
            colorset: [[1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11], [12, 13, 14], [15, 16, 17], [18, 19, 20], [21, 22]],
            mval: [760, 760, 820, 820, 900, 940, 940, 1040, 1070, 1190, 1250, 1250, 1310, 1420, 1420, 1480, 1540, 1540, 1600, 1680, 1800],
            sublist: [10, 10, 20, 20, 40, 40, 40, 60, 70, 70, 90, 90, 90, 110, 120, 120, 140, 140, 140, 160, 180, 200],
            addlist: [10, 10, 20, 20, 20, 30, 30, 30, 40, 40, 40, 50, 50, 50, 60, 60, 60, 70, 70, 70, 80, 100],
        }
        localStorage.data = JSON.stringify(data)
        localRefresh();
        alert("Welcome!!!");
        return true;
    } else {
        localRefresh();
        alert("Canceled");
        return false;
    }
}




localRefresh()

function linearSearch(colorset, number) {
    for (let array of colorset) {
        for (let element of array) {
            if (element === number) {
                return array;
            }
        }
    }
    return null;
}



function localRefresh() {
    if (localStorage.data) {
        data = Object.keys(data).length === 0 ? JSON.parse(localStorage.data) : data, localStorage.data = JSON.stringify(data);
    } else {
        ResetGame(1);
    }
    const { carowns, shipowns, helicopterowns, planeowns, car, ship, helicopter, plane, history } = data;
    document.getElementById("car").innerHTML = car;
    document.getElementById("helicopter").innerHTML = helicopter;
    document.getElementById("ship").innerHTML = ship;
    document.getElementById("plane").innerHTML = plane;
    document.getElementById("car_plots").innerHTML = carowns;
    document.getElementById("helicopter_plots").innerHTML = helicopterowns;
    document.getElementById("ship_plots").innerHTML = shipowns;
    document.getElementById("plane_plots").innerHTML = planeowns;
    document.getElementById("history").innerHTML = history;
}


// Basics


function addtoHistory(user, action) {
    data.history += user + " : " + action + "<br>";
    localRefresh();
}


function id_to_name(id) {
    return ['car', 'helicopter', 'ship', 'plane'][Number(id - 1)];
}


function Add(amount, user) {
    data[user] = parseInt(Number(data[user]) + Number(amount));
    localRefresh()
}


function sellout(slave, amount, user) {
    debugger
    var plots = data[slave + "owns"]
    let worth = data[slave]
    plots.forEach(plot => {
        worth += Number(getStatus(plot).rent)
    });
    if (worth >= amount) {
        var sorted_plots = plots.sort(function (a, b) { return a - b })
        var loot = data[slave]
        var plot_to_sell = []
        sorted_plots.forEach(plot => {
            if (amount >= loot) {
                loot += getStatus(plot).rent
                plot_to_sell.push(plot)
            }
        });
        if (user == 'bank') {
            data.plots = data.plots.filter(item => !plot_to_sell.includes(item));
            data[slave + "owns"] = plots.filter(item => !plot_to_sell.includes(item));
            plot_to_sell.forEach(plot => {
                data.plot[plot - 1] = data.base[plot - 1]
                data.sublist[plot - 1] = data.subbase[plot - 1]

            });
            addtoHistory('SERVER', `Returned & reset plots ${plot_to_sell.join(',')} to bank`)
            var refund = loot - amount
            Add(refund, slave)
            addtoHistory('SERVER', `REFUND +$${refund} -> ${slave}`)
        } else {
            data[slave + "owns"] = plots.filter(item => !plot_to_sell.includes(item));
            data[user + "owns"] = data[user + "owns"].concat(plot_to_sell)
            addtoHistory('SERVER', `Transfered plots ${plot_to_sell.join(',')} : ${slave}->${user}`)
            var refund = loot - amount
            Add(refund, slave)
            addtoHistory('SERVER', `REFUND +$${refund} -> ${slave}`)
        }

    } else {
        Add(amount, user)
        data[slave] = -100000000
        data[slave + "owns"] = []
        FINISH();
    }
}

function FINISH() {
    const users = ['car', 'helicopter', 'ship', 'plane']
    const worth_a = []
    users.forEach((user, i) => {
        let worth = data[user]
        data[user + "owns"].forEach(plot => {
            worth += getStatus(plot).rent
        });
        worth_a[i] = { user, worth }
    })
    const sorted = worth_a.sort((a, b) => b.worth - a.worth)
    const winner = sorted[0]
    alert(`${winner.user.toUpperCase()} is the winner\n${sorted[3].user} went bankrupt!!!`);
}

function Sub(amount, user, force = [1, 'bank']) {
    const final_amount = parseInt(Number(data[user]) - Number(amount))
    if (final_amount < 0 && force[0] == 1) {
        sellout(user, amount, force[1])
    } else if (final_amount < 0 && force[0] == 0) {
        alert("Insufficent Balance")
    } else {
        data[user] = final_amount;
    }

    localRefresh()
}
// Validate



function Validate(value, limit = 0) {

    if (!value) {
        const message = value === "" ? "This can't be empty!!!" : "User Cancelled";
        alert(message);
        return false;
    }

    if (limit === 1 || (typeof value === 'number' && (value > 0 && value < limit || limit === 0))) {
        return value;
    }

    return false;
}



// In App Script
function go() {
    const user = id_to_name(Validate(Number(prompt("Passing through GO\nEnter User Number")), 5))
    if (user) {
        Add(200, user);
        addtoHistory(user, "GO +$200");
    }
}
function jail() {

    const user = id_to_name(Validate(Number(prompt("Jail Release\nUse User Number")), 5))
    if (user) {
        Sub(100, user);
        addtoHistory(user, "Released from Jail -$100");
    }

}

function teli() {


    const user = id_to_name(Validate(Number(prompt("Teleport\nUse User Number")), 5))
    const place = Validate(Number(prompt("Teleport\nEnter Plot ID")), 23);

    if (user && place) {
        Sub(100, user);
        addtoHistory(user, "Teleport -> " + place + " -100");
        if (getStatus(place).bought) {
            rent(place, Id);
        } else {
            buy(place, Id);
        }

    }
}

function loadScript() {
    document.getElementById("spinner").style.visibility = "visible";
    document.title = "Monopoly";
    localRefresh();
}

(function () {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = './assets/images/favicon.png';
    document.getElementsByTagName('head')[0].appendChild(link);
})();



function getStatus(plotcode) {
    const bought = data.plots.includes(plotcode);

    // Get the owner name if the plot is bought
    let owner = "";
    if (bought) {
        const arrays = [data.carowns, data.helicopterowns, data.shipowns, data.planeowns];
        arrays.forEach((array, i) => {
            if (array.includes(plotcode)) {
                owner = id_to_name(i + 1)
            }
        });
    }
    // Return the status object
    return {
        set: linearSearch(data.colorset, plotcode),
        plotcode,
        owner,
        rent: data.plot[plotcode - 1],
        bought,
        mval: data.mval[plotcode - 1],
        add: data.addlist[plotcode - 1],
        sub: data.sublist[plotcode - 1]
    };
}



function auction(plotcode) {
    if (getStatus(Number(prompt("Plot ID for Auction?", plotcode))).bought !== true) {
        alert("Redirecting to /auction.html");
        window.open('/auction?plot=' + plotcode, 'Auction Page');
    } else {
        alert("Plot already bought!!!")
    }

}
function add() {

    a = id_to_name(Validate(Number(prompt("Add\nAdd amount to User?\nEnter User ID")), 5));
    b = Validate(Number(prompt("Add\nEnter Amount")));
    c = Validate(prompt("Add\nEnter Reason", '~'), 1);
    if (a && b && c) {
        Add(b, a);
        addtoHistory(a, "+ $" + b + "; " + c);
    }
}
function sub() {
    a = id_to_name(Validate(Number(prompt("Sub\nSub amount to User?\nEnter User ID")), 5));
    b = Validate(Number(prompt("Sub\nEnter Amount")));
    c = Validate(prompt("Sub\nEnter Reason", '~'), 1);
    if (a && b && c) {
        Sub(b, a);
        addtoHistory(a, "- $" + b + "; " + c);
    }
}


function dataPlot() {
    var a = data
    alert(`
    Total Plots Bought = ${a.plots} \n
    Car Owns = ${a.carowns} \n
    Ship Owns = ${a.shipowns} \n
    Plane Owns = ${a.planeowns} \n
    Helicopter Owns = ${a.helicopterowns} \n`)
}