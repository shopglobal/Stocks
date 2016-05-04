function Company(n,s,d,sv,h,sent){this.Name = n; this.Sector = s; this.Description = d; this.stockvalues=sv; this.svAsStr=sv; this.held = h; this.sentiment=sent;}

//initialize an array to show recent values of company stock. First element is company name
Company.prototype.initialize = function(){
  var arrayValues = new Array();
  var rand = (Math.random()*100)
  arrayValues[9] = 100;//(Math.round(rand));

  for (i = 0; i<9; i++){
    if (i==0){
      arrayValues[i] = this.Name;
    }else{
      arrayValues[i] = arrayValues[9];
    }
  }
  this.stockvalues = arrayValues;
  this.svtostring();
}

//convert stock values to 2 decimal place string for display on page
Company.prototype.svtostring = function(){
  for (i = 1; i < 10; i++) {
      //console.log("thisfrom svtostr:" + this)
      this.svAsStr[i] = (this.stockvalues[i]).toFixed(2);
  }
  this.svAsStr[0] = (this.stockvalues[0]);
};

Company.prototype.OutputValues = function(){
  var output = '<div class="projectgrid">'; //begin creating HTML string output
    //output += '<li>';
  output += '<div class="singleprojectgrid">'
  for (i = 0; i < 9; i++) {
      if (i>0){
        var xlong = this.stockvalues[i];
        var x = parseFloat(xlong).toFixed(2);
      }else{
        var x = this.stockvalues[i];
      }
      output += '<br>' + x; //outputs each stock value in a list
  }
  output += '</div>';
  output += '</div>'; //append this on to close out
  $('#projectgrid').html(output); //outputs html string to specified div ID

}

//Creates new stockvalues based on randomized values
Company.prototype.stockrandomizer = function(){
  for (i = 0; i < 9; i++) {
      this.stockvalues[i] = this.stockvalues[i+1];
  }
  var rand = (Math.random()*100)
  this.stockvalues[9] = this.stockvalues[8] + ((Math.round(rand))/100 - 0.5) + this.sentiment;
  this.stockvalues[0] = this.Name;
};

Company.prototype.updatesentiment = function(){
  this.sentiment = ((Math.random())-0.5)*5;
};
