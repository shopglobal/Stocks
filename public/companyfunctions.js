//add initialisation values for each company. Generated client side to save bandwidth.
function addvalues(element, index, array){
  element.stockvalues = [0,0,0,0,0,0,0,0,0,0];
  element.svAsStr = [0,0,0,0,0,0,0,0,0,0];
  element.held = 0;
  element.sentiment = 0;
  element.companyindex = index
}

function updatesentiment(element, index, array){
  element.sentiment = ((Math.random())-0.5)*5;
};

function svtostring(element, index, array){
  for (i = 1; i < 10; i++) {
      //console.log("thisfrom svtostr:" + this)
      element.svAsStr[i] = (element.stockvalues[i]).toFixed(2);
  }
  element.svAsStr[0] = (element.stockvalues[0]);
};



function stockrandomizerg(element, index, array){
  //console.log("in stockrandomizerg, element: " + element + " index: " + index + "array: " + array )

  for (i = 0; i < 9; i++) {
      element.stockvalues[i] = element.stockvalues[i+1];
  }
  var rand = (Math.random()*100)
  element.stockvalues[9] = element.stockvalues[8] + ((Math.round(rand))/100 - 0.5) + element.sentiment;
  element.stockvalues[0] = element.Name;
  //console.log("in stockrandomizerg, sv[0]: " + element.stockvalues[0] + " sv[1]: " + element.stockvalues[1] + " sv[1]: " + element.stockvalues[2])


};


function BuyButton(element, i){

  document.getElementById(element.Name+"buy").addEventListener("click", function(){

  //check we can afford to Buy
  if ( portfolioObj.cash > companies.company[i].stockvalues[1]){
    //console.log("within if loop")
    //declare a new openTradeto be added to trades div
    console.log("above new open trade definition")
    var newOpenTrade = new OpenTrade(tradeId,element.stockvalues[0], element.stockvalues[1], 0);
    console.log("element.stockvalues[1]: " + element.stockvalues[1])
    tradeId = tradeId+1;
    console.log("newTrade.pricePaid: " + newOpenTrade.pricePaid);
    portfolioObj.cash = portfolioObj.cash-newOpenTrade.pricePaid;
      console.log("cashheld: " + portfolioObj.cash);

    element.held = element.held + 1;
    console.log("company1 held: " + companies.company[0].held + "company2 held: " + companies.company[1].held +"company3 held: " + companies.company[2].held)

    newOpenTrade.calcPotentialProfit()
    newOpenTrade.writeToDiv()

    pchartupdate();
    //update portfolio value
    balance = portfolioObj.cash; //+ company1.held + company2.held + company3.held;
    var pfvaloutput = '<h2>Portfolio Value: £' + balance.toFixed(2) + '</h2>'; //append this on to close out
    $('#portfoliotitle').html(pfvaloutput); //outputs html string to specified div ID


    //also when we click buy button, create an event listener for the new sell button
    document.getElementById(newOpenTrade.tradeId+'sell').addEventListener("click", function(){
          var buttonId = newOpenTrade.tradeId;
          document.getElementById(buttonId+'sell').disabled = true;

          newOpenTrade.priceSold = element.stockvalues[1];
          portfolioObj.cash = portfolioObj.cash + newOpenTrade.priceSold;
          element.held = element.held - 1;
          newOpenTrade.profit = newOpenTrade.priceSold - newOpenTrade.pricePaid

          //update portfolio value
          balance = portfolioObj.cash; //+ company1.held + company2.held + company3.held;
          var pfvaloutput = '<h2>Portfolio Value: £' + balance.toFixed(2) + '</h2>'; //append this on to close out
          $('#portfoliotitle').html(pfvaloutput); //outputs html string to specified div ID

          //delete corresponding div in opentrades list
          var divdelete = document.getElementById(newOpenTrade.tradeId + "openTrade");
          divdelete.parentNode.removeChild(divdelete);

    }); //function for sell event listener


    //updating each relevant p element with latest stock prices in trades div
    setInterval(function () {
        if (document.getElementById(newOpenTrade.companyName+'img') != null){

          var currentprice = "Current Price: " + (companies.company[i].stockvalues[1]).toFixed(2);
          $("#"+newOpenTrade.tradeId+"openTrade").children('#'+newOpenTrade.companyName+'pricep').html(currentprice); //outputs as html to div ID 'update'

          var potentialProfit = "Potential Profits: " + (companies.company[i].stockvalues[1] - newOpenTrade.pricePaid).toFixed(2);
          $("#"+newOpenTrade.tradeId+"openTrade").children('#'+newOpenTrade.companyName+'profitp').html(potentialProfit); //outputs as html to div ID 'update'

          if(companies.company[i].stockvalues[1] > newOpenTrade.pricePaid){
              var useImage = 'images/' + "greenup" + '.jpg';
            }else{
              var useImage = 'images/' + "reddown" + '.jpg';
          } //DISPLAY CORRECT GREEN OR RED ARROW ACCORDING TO MOVEMENTS

          document.getElementById(newOpenTrade.companyName+'img').src =useImage; //update arrow image
        };

      }, 1000);//.bind(this), 1000);

    } //if loop for checking cash held is enough

}); //buybutton event listener

} //close out company.buybutton function
