$(document).ready(callAjax);


function callAjax(){
  var sickness = $('#sickness-name').html();

  $.ajax({
    url : '/search/'+encodeURI(sickness),
    type : 'GET',
    contentType: "application/json",
    dataType: "json",
    success:function(data){
      //var data = JSON.stringify(dataRaw);
      console.log(data);
      buildSimilarities(data.similarity.graph, data.enrichedFiles);
      buildDatas(data.similarity.graph);
      buildExpension(data.similarity.graph, data.similarity.graph);
    },
    error:function(){
      alert('oupsi');}
  });
}

function buildDatas(data){
  $('#container-data1').html('Hop, des infos');
}

function buildExpension(data1, data2){
  $('#container-expended').html('Hop, des comparaisons');
}


function buildSimilarities(graph, allPagesInfo){
  var htmlCode = '<table class="result-table">';
  if(graph.length>0)
  {
    htmlCode += '<tr> <th></th>';
    for(j in graph[0].edges){
      //TODO change to allPagesInfo[j].name
      htmlCode += '<th title="'+allPagesInfo[j].fileName+'"> Res ' + j + '</th>';
    }
    htmlCode += '</tr>';
  }
  for(i in graph){
    htmlCode += '<tr><td>r ' + i + '</td>';
    for(j in graph[i].edges){
      var taille = graph[i].edges[j]  * 48;
      htmlCode += '<td title="taux de similarité de '+graph[i].edges[j] +'">';
      if(i==j)
        htmlCode += ' - ' ;
      else {
        htmlCode += '<div class="back-circle" style="width:' + taille +'px;height: ' + taille + 'px">';
        htmlCode += '<div class="front-circle" style="opacity : '+ graph[i].edges[j] +'"></div>';
      }
      htmlCode += '</div>';
      htmlCode += '</td>';
    }
    htmlCode += '</tr>';
  }
  htmlCode += '</table>';
  $('#container-similarities').html(htmlCode);
}