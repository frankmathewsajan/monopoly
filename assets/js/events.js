const events = {
    HAUNTED_HOUSE: {
        info: "Something strange is going on! Swap another player's property with one of yours.",
        fn: function (_title) {
            const his_plot = Validate(Number(prompt(`${_title}\nPick another player\nAsk him/her to choose one of his property to trade\nEnter his/her PlotID`)), 23);
            const your_plot = Validate(Number(prompt(`${_title}\nChoose one of your property to trade\nEnter the PlotID`)), 23);
            

            if (his_plot && your_plot) {
                const he = getStatus(his_plot).owner
            const you = getStatus(your_plot).owner
                data[he + "owns"] = data[he + "owns"].filter(item => item !== his_plot);
                data[you + "owns"].push(his_plot);
                data[you + "owns"] = data[you + "owns"].filter(item => item !== your_plot);
                data[he + "owns"].push(your_plot);
                addtoHistory('EVENT', `Ownership of ${his_plot} and ${your_plot} swapped!`);
            }
        }
    },
    TORNADO_ALLEY: {
        info: "Hey, where did the roof go?",
        fn: function (_title) {
            const your_plot = Validate(Number(prompt(`${_title}\nChoose one of your property to reset it to level 1\nEnter the PlotID`)), 23)
            if (your_plot) {
                data.lvl[your_plot - 1] = 0
                addtoHistory('EVENT', `Rent Reset to Level 1, Plot ${your_plot}`)
            }
        }
    },

    GRAND_DESIGNS: {
        info: "One of you property gets a TV makeover!",
        fn: function (_title) {
            const your_plot = Validate(Number(prompt(`${_title}\nChoose one of your property to upgrade it to level 5\nEnter the PlotID`)), 23)
            if (your_plot) {
                data.lvl[your_plot - 1] = 4
                addtoHistory('EVENT', `Rent Upgraged to Level 5, Plot ${your_plot}`)
            }
        }
    },
    BOOM_TOWN: {
        info: "Property prices bounce back!",
        fn: function (_title) {
            const your_plot = Validate(Number(prompt(`${_title}\nChoose a property to buy it, auction it or raise rent level\nEnter the PlotID`)), 23)
            if (your_plot) {
                property(your_plot, 1)
                addtoHistory('EVENT', "Boom'in Business")
            }
        }
    },
    PICK_YOUR_OWN: {
        info: "Catch someone stealing you tomatoes",
        fn: function (_title) {
            alert(`${_title}\nGive the card to someone and put em in jail`)
        }
    },
    TOTAL_GRIDLOCK: {
        info: "Faulty traffic lights get the street in a jam!",
        fn: function (_title) {
            alert(`${_title}\nMove everyone to Free Parking\nIf you in jail, STAY!!!`)
        }
    },
    HIGHWAY_TAX: {
        info: "Your road need repairs",
        fn: function (_title) {
            const id = Validate(Number(prompt(`${_title}\nPay $50 per property you own\nEnter your UserID`)), 5)
            if (id) {
                let price = 0
                data[id_to_name(id) + "owns"].forEach(plot => {
                    price += 50
                });
                Sub(price, id_to_name(id))
                addtoHistory('EVENT', `-$${price} : Tax : ${id_to_name(id)}`)
            }
        }
    },
    LOVE_IS_IN_THE_AIR: {
        info: "Meet someone special right up you street!",
        fn: function (_title) {
            const id_1 = Validate(Number(prompt(`${_title}\nGift $200 to the special friend\nEnter his/her UserID`)), 5)
            const id_2 = Validate(Number(prompt(`${_title}\nGift yourself $200\nEnter your UserID`)), 5)
            if (id_1 && id_2) {
                Add(200, id_to_name(id_1))
                Add(200, id_to_name(id_2))
                addtoHistory('EVENT', `+$${200} : ${`${_title.replace(/_/g,' ').slice(0, 20)}`} : ${id_to_name(id_1)} & ${id_to_name(id_2)}`)
            }
        }
    },
    PONG_WHAT_A_STINKER: {
        info: "The local sewer springs a leak!",
        fn: function (_title) {
            const your_plot = Validate(Number(prompt(`${_title}\nChoose a property to lower the rent level on the side of the board.\nEnter the PlotID`)), 23)
            if (your_plot) {
                const side_array = getStatus(your_plot).side
                let t = []
                side_array.forEach(plot => {
                    if (getStatus(plot).bought) {
                        degradeCost(plot, 0)
                        t.push(plot)
                    }
                });
                addtoHistory('EVENT', `${`${_title.replace(/_/g,' ').slice(0, 20)}`} : Rent level of ${t.join(',')} lowered`)
            }
        }
    },
    WHAT_A_RIDE: {
        info: "Your local theme park builds the world's craziest roller-coaster!",
        fn: function (_title) {
            const your_plot = Validate(Number(prompt(`${_title}\nChoose a property to raise the rent level on the side of the board.\nEnter the PlotID`)), 23)
            if (your_plot) {
                const side_array = getStatus(your_plot).side
                let t = [];
                side_array.forEach(plot => {
                    if (getStatus(plot).bought) {
                        updateCost(plot, 0)
                        t.push(plot)
                    }
                });
                addtoHistory('EVENT', `${`${_title.replace(/_/g,' ').slice(0, 20)}`} : Rent level of ${t.join(',')} raised`)
            }
        }
    },
    ON_THE_MAP: {
        info: "The new railway station gets the go-ahead",
        fn: function (_title) {
            const your_plot = Validate(Number(prompt(`${_title}\nChoose a property to raise the rent level on the color set.\nEnter the PlotID`)), 23)
            if (your_plot) {
                const side_array = getStatus(your_plot).set
                let t = []
                side_array.forEach(plot => {
                    if (getStatus(plot).bought) {
                        updateCost(plot, 0)
                        t.push(plot)
                    }
                });
                addtoHistory('EVENT', `${`${_title.replace(/_/g,' ').slice(0, 20)}`} : Rent level of ${t.join(',')} raised`)
            }
        }
    },

    TIS_THE_SEASON: {
        info: "You've caught that nasty cough going around!",
        fn: function (_title) {
            const your_plot = Validate(Number(prompt(`${_title}\nChoose a property to drop the rent level on the color set.\nEnter the PlotID`)), 23)
            if (your_plot) {
                const side_array = getStatus(your_plot).set
                let t = []
                side_array.forEach(plot => {
                    if (getStatus(plot).bought) {
                        degradeCost(plot, 0)
                        t.push(plot)
                    }
                });
                addtoHistory('EVENT', `${`${_title.replace(/_/g,' ').slice(0, 20)}`} : Rent level of ${t.join(',')} lowered`)
            }
        }
    },
    HOUSE_PARTY: {
        info: "The good times go on till late!",
        fn: function (_title) {
            const your_plot = Validate(Number(prompt(`${_title}\nChoose a property to drop the rent level of neighbors & raise yours.\nEnter the PlotID`)), 23)
            if (your_plot) {
                const side_array = getStatus(your_plot).neighbor
                let t = []

                side_array.forEach(plot => {
                    if (getStatus(plot).bought) {
                        if (plot == your_plot) {
                            updateCost(plot, 0)

                        } else {
                            degradeCost(plot, 0)
                            t.push(plot)
                        }
                    }
                });
                addtoHistory('EVENT', `${`${_title.replace(/_/g,' ').slice(0, 20)}`} : Rent level of ${t.join(',')} lowered, ${your_plot} raised`)
            }
        }
    }

}

Object.assign(events, {
    DEAL_OF_THE_WEEK: events.BOOM_TOWN,
    WIBBLE_WOBBLE: events.LOVE_IS_IN_THE_AIR,
    STOP_THE_PRESSES: events.BOOM_TOWN,
    IN_THE_MONEY: events.HAUNTED_HOUSE,
    DEMOLISHED: events.TORNADO_ALLEY,
    ROVERS_REVENGE: events.TORNADO_ALLEY,
    ON_THE_RUN: events.TORNADO_ALLEY,
    CRIME_DOWN: events.ON_THE_MAP,
    ITS_A_BOY: events.HOUSE_PARTY
});