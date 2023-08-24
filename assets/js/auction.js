(function () {
  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = './assets/images/favicon.png';
  document.getElementsByTagName('head')[0].appendChild(link);
})();

let data = {}
data = Object.keys(data).length === 0 ? JSON.parse(localStorage.data) : data, localStorage.data = JSON.stringify(data);

let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let plot = Number(params.get('plot'));
document.getElementById("plot_id").innerText = `Plot  ${plot}`

let up = getStatus(plot).cost - 10
document.getElementById("plot_rent").innerText = `${up}`

function raise() {
  resetTimer()
  up += 20
  document.getElementById("plot_rent").innerText = `${up}`
}
let interval

function resetTimer() {
  try {
    clearInterval(interval);
  } catch (error) {
    console.log(error);
  }
  let time = 100;
  interval = setInterval(function () {
    document.getElementById('progress').style.width = `${time}%`
    if (time === 0) {
      clearInterval(interval);

      location.replace(`/?act=[${Number(prompt(`Plot ${plot} sold for ${up}\n Enter UserID`))},${plot},${up}]`)
    }
    time -= 20
  }, 500);
}

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
  const i = plotcode - 1;
  debugger
  return {
    set: linearSearch(data.colorset, plotcode),
    plotcode,
    owner,
    rent: data.plot_data[i][data.lvl[i]],
    lvl: data.lvl[i],
    bought,
    cost: data.but_price[i]
  };
}
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

function id_to_name(id) {
  return ['car', 'helicopter', 'ship', 'plane'][Number(id - 1)];
}