$.getJSON("companyprofile.json", function(companies) {
    // data is a JavaScript object now. Handle it as such

var tradeId = 1 //identifier for individual trades, incremented on 'buy' click

//initialise 'class' for Company objects, OpenTrades and ClosedTrades

function OpenTrade(id,cn,pp,pn){this.tradeId = id; this.companyName = cn; this.pricePaid = pp; this.priceNow = pn;}
function ClosedTrade(id,cn,pp,pn,pm){this.tradeId = id; this.companyName = cn; this.pricePaid = pp; this.priceSold = pn; this.profitMade = pm;}


//currently not generic due to 'company1'. TODO: Make generic
OpenTrade.prototype.calcPotentialProfit = function(){
   var potentialProfit = company1.stockvalues[1] - this.pricePaid;
   this.potentialProfit = potentialProfit;
   console.log("potentialProfit: " + this.potentialProfit)
};

//write new openTrade to trades div
OpenTrade.prototype.writeToDiv = function(){
console.log("this:" + this)
  var output = '<div id="'+this.tradeId+'openTrade" class="openTrade">';
  output += ' <img class="logo" src="images/' + this.companyName + '.jpg">';
  output += '<p>' + 'Price Paid:' + (this.pricePaid).toFixed(2) + '</p>';
  //output += '<p>' + 'Company:' + this.companyName + '</p>';
  output += '<p id="' + this.companyName + 'pricep">' + 'x' +/*'Current Value:' + company1.stockvalues[1] +*/ '</p>';
  this.calcPotentialProfit()
  output += '<p id="' + this.companyName + 'profitp">' + 'x' +/*'Potential Profit:' + this.potentialProfit +*/ '</p>';
  output += ' <img class="arrow" id="' + this.companyName + 'img" src="">' + '</img>';
  output += '<input type ="button" id="'+this.tradeId+'sell" value="SELL" class="sellbutton"></div>'
  $('#trades').append(output);
};


$( document ).ready(function() {

  Company.prototype.BuyButton = function(){

    document.getElementById(this.Name+"buy").addEventListener("click", function(){
      //var this = company1;
    //check we can afford to Buy
    if ( cashheld > this.stockvalues[1]){

      //declare a new openTradeto be added to trades div
      var newOpenTrade = new OpenTrade(tradeId,this.stockvalues[0], this.stockvalues[1], 0);

      tradeId = tradeId+1;
      console.log("newTrade.pricePaid: " + newOpenTrade.pricePaid);
      cashheld = cashheld-newOpenTrade.pricePaid;
      console.log("cashheld: " + cashheld);

      this.held = this.held + 1;
      console.log("company1 held: " + company1.held + "company2 held: " + company2.held +"company3 held: " + company3.held)


      newOpenTrade.calcPotentialProfit()
      newOpenTrade.writeToDiv()

    pchartupdate();
    //update portfolio value
    balance = cashheld; //+ company1.held + company2.held + company3.held;
    var pfvaloutput = '<h2>Portfolio Value: £' + balance.toFixed(2) + '</h2>'; //append this on to close out
    $('#portfoliotitle').html(pfvaloutput); //outputs html string to specified div ID


    //event listener for the new sell button
    document.getElementById(newOpenTrade.tradeId+'sell').addEventListener("click", function(){
          var buttonId = newOpenTrade.tradeId;
          //console.log("in event listener, newOpenTrade.TradeId:" + buttonId)
          document.getElementById(buttonId+'sell').disabled = true;

          newOpenTrade.priceSold = this.stockvalues[1];
          cashheld = cashheld + newOpenTrade.priceSold;
          console.log("newOpenTrade.priceSold: " + newOpenTrade.priceSold);

          this.held = this.held - 1;
            Pearheld = Pearheld - 1;
            newOpenTrade.profit = newOpenTrade.priceSold - newOpenTrade.pricePaid
            console.log("newOpenTrade.profit: " + newOpenTrade.profit);
            console.log("cashheld: " + cashheld);

            //update chart
            pchartupdate();
            //update portfolio value
            balance = cashheld; //+ company1.held + company2.held + company3.held;
            console.log("company1 held: " + company1.held + "company2 held: " + company2.held +"company3 held: " + company3.held)
            var pfvaloutput = '<h2>Portfolio Value: £' + balance.toFixed(2) + '</h2>'; //append this on to close out
            $('#portfoliotitle').html(pfvaloutput); //outputs html string to specified div ID

            //delete corresponding div in opentrades list
            var divdelete = document.getElementById(newOpenTrade.tradeId + "openTrade");
            divdelete.parentNode.removeChild(divdelete);


      }.bind(this)); //function for sell event listener
      console.log("this from before intervalfn:" + this.Name)
      //updating each relevant p element with latest stock prices in trades div


      setInterval(function () {
          //console.log("set interval called");
          if (this.Name == "Pear"){
              var currentprice = "Current Price: " + (company1.stockvalues[1]).toFixed(2);
          }else if (this.Name == "Goofle") {
              var currentprice = "Current Price: " + (company2.stockvalues[1]).toFixed(2);
          }else if (this.Name == "Twitta") {
              var currentprice = "Current Price: " + (company3.stockvalues[1]).toFixed(2);
          };
          //console.log("newOpenTrade.tradeId: " + newOpenTrade.tradeId)
          $("#"+newOpenTrade.tradeId+"openTrade").children('#'+newOpenTrade.companyName+'pricep').html(currentprice); //outputs as html to div ID 'update'
          //var potentialProfit = "Potential Profits: " + (company1.stockvalues[1] - newOpenTrade.pricePaid);

          if (this.Name == "Pear"){
              var potentialProfit = "Potential Profits: " + (company1.stockvalues[1] - newOpenTrade.pricePaid).toFixed(2);

              if(company1.stockvalues[1] > newOpenTrade.pricePaid){
                  var useImage = 'images/' + "greenup" + '.jpg';
                }else{
                  var useImage = 'images/' + "reddown" + '.jpg';

              } //DISPLAY CORRECT GREEN OR RED ARROW ACCORDING TO MOVEMENTS

          }else if (this.Name == "Goofle") {
              var potentialProfit = "Potential Profits: " + (company2.stockvalues[1] - newOpenTrade.pricePaid).toFixed(2);

              if(company2.stockvalues[1] > newOpenTrade.pricePaid){
                var useImage = 'images/' + "greenup" + '.jpg';
              }else{
                var useImage = 'images/' + "reddown" + '.jpg';


              } //DISPLAY CORRECT GREEN OR RED ARROW ACCORDING TO MOVEMENTS

          }else if (this.Name == "Twitta") {
              var potentialProfit = "Potential Profits: " + (company3.stockvalues[1] - newOpenTrade.pricePaid).toFixed(2);

              if(company3.stockvalues[1] > newOpenTrade.pricePaid){
                var useImage = 'images/' + "greenup" + '.jpg';
              }else{
                var useImage = 'images/' + "reddown" + '.jpg';


              } //DISPLAY CORRECT GREEN OR RED ARROW ACCORDING TO MOVEMENTS
          };

          $("#"+newOpenTrade.tradeId+"openTrade").children('#'+newOpenTrade.companyName+'profitp').html(potentialProfit); //outputs as html to div ID 'update'
          document.getElementById(newOpenTrade.companyName+'img').src=useImage; //update arrow image
      }.bind(this), 1000);
  } //if loop for checking cash held is enough

}.bind(this)); //function for buy event listener, bind object.

} //close out company.buybutton function
}); //close out document.ready


//Create instances of companies from constructor class and JSON input
var company1 = new Company(companies.company[0].Name, companies.company[0].Sector, companies.company[0].Description, [0,0,0,0,0,0,0,0,0,0], 0, 0);
var company2 = new Company(companies.company[1].Name, companies.company[1].Sector, companies.company[1].Description, [0,0,0,0,0,0,0,0,0,0], 0, 0);
var company3 = new Company(companies.company[2].Name, companies.company[2].Sector, companies.company[2].Description, [0,0,0,0,0,0,0,0,0,0], 0, 0);

//Call Company method to initialise stock values
company1.initialize();
company2.initialize();
company3.initialize();

//iterative randomize and convert to array of 2dp string values
setInterval(function update(){
  company1.stockrandomizer();
  company1.svtostring();
  company2.stockrandomizer();
  company2.svtostring();
  company3.stockrandomizer();
  company3.svtostring();
},1000);

setInterval(function (){
  company1.updatesentiment();
  company2.updatesentiment();
  company3.updatesentiment();
},4000);

//Create charts
var chart = c3.generate({
    bindto: '#chart',
    data: {
        x: 'x',
//        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
        columns: [
            ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
            //['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
            company1.svAsStr, company2.svAsStr, company3.svAsStr//['data1', 30, 50, 300, 400, 150, 250],
            //['data2', 130, 340, 200, 500, 250, 350]
        ]
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%m-%d'
            }
        }
    }
});

setInterval(function () {
    //console.log(stockvalues)

    //var currentprice = 'Current prices:' + company1.svAsStr[1] + company2.svAsStr[1] + company3.svAsStr[1]; //append this on to close out
    var company1price = '<p> £' + company1.svAsStr[1] + '</p>';
    $('#'+company1.Name).children('#price').html(company1price); //outputs as appended html html to company grid element
    var company2price = '<p> £' + company2.svAsStr[1] + '</p>';
    $('#'+company2.Name).children('#price').html(company2price); //outputs as appended html html to company grid element
    var company3price = '<p> £' + company3.svAsStr[1] + '</p>';
    $('#'+company3.Name).children('#price').html(company3price); //outputs as appended html html to company grid element

    chart.load({
        columns: [
            company1.svAsStr, company2.svAsStr, company3.svAsStr//['data3', 400, 500, 450, 700, 600, 500]
        ]
    });
}, 1000);


//initialise portfolio tracker variables
var cashheld = 1000;
var Pearheld = 0;
var Goofleheld = 0;
var Twittaheld = 0;
var balance = cashheld;// + Pearheld + Goofleheld + Twittaheld;

//initialise portfolio value
var pfvaloutput = '<h2>Portfolio Value: £' + balance.toFixed(2) + '</h2>'; //append this on to close out
$('#portfoliotitle').html(pfvaloutput); //outputs html string to specified div ID

var pearportfolio = company1.held*company1.stockvalues[1]
var goofleportfolio = company2.held*company2.stockvalues[1]
var twittaportfolio = company3.held*company3.stockvalues[1]

var portfoliochart = c3.generate({

    bindto: '#portfolio',
    data: {
        columns: [
          ['Cash', cashheld.toFixed(0)],
          ['Pear', pearportfolio.toFixed(0)],
          ['Goofle', goofleportfolio.toFixed(0)],
          ['Twitta', twittaportfolio.toFixed(0)]
        ],
        type : 'donut',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    donut: {
        title: "Portfolio"//,
    }
});

  //function to update vales contained within portfolio donut chart
function pchartupdate(){
  var pearportfolio = company1.held*company1.stockvalues[1]
  var goofleportfolio = company2.held*company2.stockvalues[1]
  var twittaportfolio = company3.held*company3.stockvalues[1]
  console.log("pearport: " + pearportfolio)

  portfoliochart.load({
         columns: [
           ['Cash', cashheld.toFixed(0)],
           ['Pear', pearportfolio.toFixed(0)],
           ['Goofle', goofleportfolio.toFixed(0)],
           ['Twitta', twittaportfolio.toFixed(0)]
    ]
    });
}

  //add event listeners and functionality to Buy buttons for each stock
  $( document ).ready(function() {
  company1.BuyButton();
  company2.BuyButton();
  company3.BuyButton();
  }); //document ready to prevent null id requests



}); //get JSON
