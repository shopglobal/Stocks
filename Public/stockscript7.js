var companies = {}
var tradeId = 1 //identifier for individual trades, incremented on 'buy' click
var portfolioObj = {};
var balance = 0;
var portfoliochart = 0;

var pearportfolio = 0;
var goofleportfolio = 0;
var twittaportfolio = 0;

//initialise 'class' for OpenTrades and ClosedTrades
function OpenTrade(id,cn,pp,pn){this.tradeId = id; this.companyName = cn; this.pricePaid = pp; this.priceNow = pn;}
function ClosedTrade(id,cn,pp,pn,pm){this.tradeId = id; this.companyName = cn; this.pricePaid = pp; this.priceSold = pn; this.profitMade = pm;}

var company1 = {};
var company2 = {};
var company3 = {};


$.getJSON("companyprofile.json", function(companiesJSON) {
    // data is a JavaScript object now. Handle it as such
    companies = companiesJSON;
    //initialisation of company stock value parameters

    console.dir(companies);


//var companiesobj = $.parseJSON(companies);
//console.log("companies.name[1]: " + companies.company[1].Name);
//var numberofcompanies = Object.keys(companies.company).length
//console.log("number of companies: " + numberofcompanies);



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



console.log("companies.company[0]: " + companies.company[0])

//Create instances of companies from constructor class and JSON input
company1 = new Company(companies.company[0].Name, companies.company[0].Sector, companies.company[0].Description, [0,0,0,0,0,0,0,0,0,0], 0, 0);
company2 = new Company(companies.company[1].Name, companies.company[1].Sector, companies.company[1].Description, [0,0,0,0,0,0,0,0,0,0], 0, 0);
company3 = new Company(companies.company[2].Name, companies.company[2].Sector, companies.company[2].Description, [0,0,0,0,0,0,0,0,0,0], 0, 0);

//Call Company method to initialise stock values
company1.initialize();
company2.initialize();
company3.initialize();

companies.company.forEach(addvalues);

//iterative randomize and convert to array of 2dp string values
setInterval(function update(){
  company1.stockrandomizer();
  company1.svtostring();
  company2.stockrandomizer();
  company2.svtostring();
  company3.stockrandomizer();
  company3.svtostring();

  companies.company.forEach(stockrandomizerg);
  companies.company.forEach(svtostring);
},1000);

$( document ).ready(function() {

setInterval(function (){
  company1.updatesentiment();
  company2.updatesentiment();
  company3.updatesentiment();

  companies.company.forEach(updatesentiment);
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


//initialise portfolio tracker variables
var cashheld = 1000;
var Pearheld = 0;
var Goofleheld = 0;
var Twittaheld = 0;
balance = cashheld;// + Pearheld + Goofleheld + Twittaheld;

setInterval(function () {
  //console.log("companies.company[0].svAsStr[1]" + companies.company[0].svAsStr[1])
  //console.dir("companies.company[0].svAsStr" + companies.company[0].svAsStr)
    //var currentprice = 'Current prices:' + company1.svAsStr[1] + company2.svAsStr[1] + company3.svAsStr[1]; //append this on to close out
    var company1price = '<p> £' + companies.company[0].svAsStr[1] + '</p>';
    $('#'+company1.Name).children('#price').html(company1price); //outputs as appended html html to company grid element
    var company2price = '<p> £' + companies.company[1].svAsStr[1] + '</p>';
    $('#'+company2.Name).children('#price').html(company2price); //outputs as appended html html to company grid element
    var company3price = '<p> £' + companies.company[2].svAsStr[1] + '</p>';
    $('#'+company3.Name).children('#price').html(company3price); //outputs as appended html html to company grid element

    chart.load({
        columns: [
            companies.company[0].svAsStr, companies.company[1].svAsStr, companies.company[2].svAsStr//['data3', 400, 500, 450, 700, 600, 500]
        ]
    });

    pchartupdate();

    if ( companies.company[0].hasOwnProperty('stockvalues') ) {

      var totalstockvalue = 0
      for(i = 0; i < Object.keys(companies.company).length; i++) {
        totalstockvalue = totalstockvalue + companies.company[i].held*companies.company[i].stockvalues[1];
      };

      balance = (portfolioObj.cash + totalstockvalue).toFixed(2);
      console.log(balance)
      pfvaloutput = '<h2>Portfolio Value: £' + balance + '</h2>';
      $('#portfoliotitle').html(pfvaloutput); //outputs html string to specified div ID
      }
}, 1000);




//initialise portfolio value
var pfvaloutput = '<h2>Portfolio Value: £' + balance.toFixed(2) + '</h2>'; //append this on to close out
$('#portfoliotitle').html(pfvaloutput); //outputs html string to specified div ID


//Function to update Portfolio Object

function updatePortfolioObj(element, index, array){
  if ( element.hasOwnProperty('stockvalues') ) {
    var key = element.Name;
    //console.dir(element);
    console.log("element.Name: " + element.Name)
    console.log("element.stockvalues: " + element.stockvalues)
    portfolioObj[key] =  element.held*element.stockvalues[1];
  }
};
//call function and log output
companies.company.forEach(updatePortfolioObj)
portfolioObj["cash"] = cashheld;
//console.dir(portfolioObj);





  //add event listeners and functionality to Buy buttons for each stock

   console.log("companies.lenth: " + companies.length)
   for (i = 0; i < Object.keys(companies.company).length; i++) {
     console.log("portfolioObj from within for loop:" + portfolioObj);
     //var currentcompany = companies.company[i]
     BuyButton(companies.company[i], i)
    }

   //companies.company.forEach(BuyButton);
  //company2.BuyButton();
  //company3.BuyButton();
  }); //document ready to prevent null id requests

  if ( companies.company[0].hasOwnProperty('stockvalues') ) {
    console.log("companies.company[0] has own value")
    pearportfolio = companies.company[0].held*companies.company[0].stockvalues[1];
    goofleportfolio = companies.company[1].held*companies.company[1].stockvalues[1];
    twittaportfolio = companies.company[2].held*companies.company[2].stockvalues[1];
}

  portfoliochart = c3.generate({

      bindto: '#portfolio',
      data: {
          columns: [
            ['Cash', portfolioObj.cash.toFixed(0)],
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


}); //get JSON






//function to update vales contained within portfolio donut chart
function pchartupdate(){
  //console.log("within pchartupdate")
  var pearportfolio = companies.company[0].held*companies.company[0].stockvalues[1]
  var goofleportfolio = companies.company[1].held*companies.company[1].stockvalues[1]
  var twittaportfolio = companies.company[2].held*companies.company[2].stockvalues[1]
  console.log("pearport: " + pearportfolio + " companies.company[0].held: " + companies.company[0].held + " companies.company[0].stockvalues[1]: " + companies.company[0].stockvalues)

portfoliochart.load({
       columns: [
         ['Cash', portfolioObj.cash.toFixed(0)],
         ['Pear', pearportfolio.toFixed(0)],
         ['Goofle', goofleportfolio.toFixed(0)],
         ['Twitta', twittaportfolio.toFixed(0)]
  ]
  });
}
