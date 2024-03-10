let data = {}


function ResetGame(p = 0) {
    if (p == 1 || confirm("Reset the Whole Game?")) {
        data = {
            car: 1500,
            ship: 1500,
            helicopter: 1500,
            plane: 1500,
            history: 'Server Started &nbsp;<i class="fa fa-database" aria-hidden="true"></i><br>',
            but_price: [60, 60, 100, 100, 120, 140, 140, 160, 180, 180, 200, 220, 220, 240, 260, 260, 280, 300, 300, 320, 350, 400],
            plot_data: [[70, 130, 220, 370, 750], [70, 130, 220, 370, 750], [80, 140, 240, 410, 800], [100, 160, 260, 440, 860], [110, 180, 290, 460, 900], [110, 180, 290, 460, 900], [130, 200, 310, 490, 980], [140, 210, 330, 520, 1e3], [140, 210, 330, 520, 1e3], [160, 230, 350, 550, 1100], [170, 250, 380, 580, 1160], [170, 250, 380, 580, 1160], [190, 270, 400, 610, 1200], [200, 280, 420, 640, 1300], [260, 520, 780, 1040, 1300], [260, 520, 780, 1040, 1300], [220, 300, 440, 670, 1340], [230, 320, 460, 700, 1400], [230, 320, 460, 700, 1400], [250, 340, 480, 730, 1440], [270, 360, 510, 740, 1500], [300, 400, 560, 810, 1600]],

            plots: [],
            carowns: [],
            shipowns: [],
            planeowns: [],
            helicopterowns: [],
            colorset: [
                [1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [9, 10, 11],
                [12, 13, 14],
                [15, 16, 17],
                [18, 19, 20],
                [21, 22]
            ],
            sideset: [
                [1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10, 11],
                [12, 13, 14, 15, 16, 17],
                [18, 19, 20, 21, 22]
            ],
            lvl: Array(22).fill(-1)
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
    const {
        carowns,
        shipowns,
        helicopterowns,
        planeowns,
        car,
        ship,
        helicopter,
        plane,
        history
    } = data;

    let selectStuff = "<option selected>Draw&nbsp;&nbsp;&nbsp;&nbsp;</option>"
    Object.keys(events).forEach((option, i) => {
        selectStuff += `<option value="${i}">${option.replace(/_/g, ' ')}</option>`
    });
    document.getElementById("car").innerHTML = car;
    document.getElementById("helicopter").innerHTML = helicopter;
    document.getElementById("ship").innerHTML = ship;
    document.getElementById("plane").innerHTML = plane;
    document.getElementById("car_plots").innerHTML = carowns;
    document.getElementById("helicopter_plots").innerHTML = helicopterowns;
    document.getElementById("ship_plots").innerHTML = shipowns;
    document.getElementById("plane_plots").innerHTML = planeowns;
    document.getElementById("history").innerHTML = history;
    document.getElementById("select_stuff").innerHTML = selectStuff;



}


// Basics
function addtoHistory(user, action) {
    data.history += user + " : " + action + "<br>";
    localRefresh();
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}


function id_to_name(id) {
    return ['car', 'helicopter', 'ship', 'plane'][Number(id - 1)];
}


function Add(amount, user) {
    if (typeof user !== 'string') {
        alert('Use id_to_name')
        return false
    }
    data[user] = parseInt(Number(data[user]) + Number(amount));
    localRefresh()
    return 200
}


function sellout(slave, amount, user) {
    debugger
    var plots = data[slave + "owns"]
    let worth = data[slave]
    plots.forEach(plot => {
        worth += Number(getStatus(plot).rent)
    });
    if (worth >= amount) {
        var sorted_plots = plots.sort(function (a, b) {
            return a - b
        })
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
                data.lvl[plot - 1] = -1

            });
            addtoHistory('SERVER', `Returned & reset plots ${plot_to_sell.join(',')} to bank`)
            alert(`Returned & reset plots ${plot_to_sell.join(',')} to bank`)
            var refund = loot - amount
            Add(refund, slave)
            addtoHistory('SERVER', `REFUND +$${refund} -> ${slave}`)
            alert(`REFUND +$${refund} -> ${slave}`)
        } else {
            data[slave + "owns"] = plots.filter(item => !plot_to_sell.includes(item));
            data[user + "owns"] = data[user + "owns"].concat(plot_to_sell)
            addtoHistory('SERVER', `Transfered plots ${plot_to_sell.join(',')} : ${slave}->${user}`)
            alert(`Returned & reset plots ${plot_to_sell.join(',')} to bank`)
            var refund = loot - amount
            Add(refund, slave)
            addtoHistory('SERVER', `REFUND +$${refund} -> ${slave}`)
            alert(`REFUND +$${refund} -> ${slave}`)
        }

    } else {
        Add(amount, user)
        data[slave] = -1000
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
        worth_a[i] = {
            user,
            worth
        }
    })
    const sorted = worth_a.sort((a, b) => b.worth - a.worth)
    const winner = sorted[0]
    alert(`${winner.user.toUpperCase()} is the winner\n${sorted[3].user} went bankrupt!!!`);
}

function Sub(amount, user, force = [1, 'bank']) {
    if (typeof user !== 'string') {
        alert('Use id_to_name')
        return false
    }
    const final_amount = parseInt(Number(data[user]) - Number(amount))
    if (final_amount < 0 && force[0] == 1) {
        sellout(user, amount, force[1])
        return false
    } else if (final_amount < 0 && force[0] == 0) {
        alert("Insufficent Balance")
        return false
    } else {
        data[user] = final_amount;
        return 200
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

function SaveGame() {
    const text = btoa(JSON.stringify(data))
    const filename = 'monopoly.txt'
    var blob = new Blob([text], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function LoadGame() {
    const content = prompt('Enter your save data')
    data = JSON.parse(atob(content))
    localRefresh()
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

    const id = Validate(Number(prompt("Teleport\nUse User Number")))
    const user = id_to_name(id, 5)
    const place = Validate(Number(prompt("Teleport\nEnter Plot ID")), 23);

    if (user && place) {
        Sub(100, user);
        addtoHistory(user, "Teleport -> " + place + " -100");
        if (getStatus(place).bought) {
            rent(place, id);
        } else {
            buy(place, id);
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
    const neighbor = (plot) => {
        if (plot === 1) return [1, 2];
        if (plot === 22) return [21, 22];
        return [plot - 1, plot, plot + 1];
    };

    // Return the status object
    const i = plotcode - 1;
    return {
        set: linearSearch(data.colorset, plotcode),
        side: linearSearch(data.sideset, plotcode),
        neighbor: neighbor(plotcode),
        plotcode,
        owner,
        rent: data.plot_data[i][data.lvl[i]],
        lvl: data.lvl[i],
        bought,
        cost: data.but_price[i]
    };
}



function auction(plotcode) {
    var plotcode = Validate(Number(prompt("Plot ID for Auction?", plotcode)), 23)
    if (plotcode && getStatus(plotcode).bought !== true) {
        alert("Redirecting to Auction Page");
        location.replace(`/auction?plot=${plotcode}`);
    } else if (plotcode) {
        alert(`Plot already owned by ${getStatus(plotcode).owner}\nPay rent & move on dude`)
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

var topBtn = document.getElementById("topBtn");
window.onscroll = function () {
    if (document.documentElement.scrollTop > 40) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
};
function topFunction() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}
