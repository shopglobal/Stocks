  $.getJSON('companyprofile.json', function(data){

    var output = '<div class="companygrid">'; //begin constructing div
    $.each(data, function(key, val) {
      $.each(val, function(k, v) { //do twice because objects are nested

      output += '<div class="singlecompanygrid" id="'+ v.Name + '">'
      output += '<h3>' + v.Name + '</h3>'; //outputs each val
      output += ' <img src="images/' + v.Name + '.jpg">';
      output += '<p>' + "Sector: " + v.Sector + '</p>';
      output += '<p>' + v.Description + '</p>';
      output += '<div id="price"> £ </div>';
      output += '<input type ="button" id="'+v.Name+'buy" value="BUY" class="buybutton">'
      output += '</div>';

    });
    });
    output += '</div>'; //Close out div
  $('#companyinfo').html(output); //output as html to div ID 'company info'
  }); //get JSON  console.log(output);
