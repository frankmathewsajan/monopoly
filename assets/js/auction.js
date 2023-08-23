
alert(localStorage.auctionplot);
function SisBought(plotcode) {
    var a = localStorage.plots;
    var mpc = plotcode + ", ";
    var b = a.includes(mpc);
    if (b == true) {
       alert("This plot is already bought, Auction is not Allowed!!!");
       KKPP();
    } else {
       return plotcode;
    } 
 }
 function auction(plotcode) {
    var a = prompt("Plot ID for Auction?", plotcode);
    SisBought(plotcode);
    alert("Redirecting to /auction.html");
    localStorage.auctionplot = plotcode;
    window.open('/auction.html','Auction Page');
}




function raise() {
    
}