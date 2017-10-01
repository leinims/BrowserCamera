
var pixel = function (id, r, g, b)  {
    this.id = id;
    this.r = r;
    this.g = g;
    this.b = b;
};

function addFilter(imageData, filter) {
    let dataTemp = imageData;
    let l = imageData.data.length / 4;
    for (let i = 0; i < l; i++) {
      let myPixel = new pixel(i, imageData.data[i * 4 + 0], imageData.data[i * 4 + 1], imageData.data[i * 4 + 2]);
      let leftPixel = i % canvasWidth !=1 ? new pixel(i-1, imageData.data[(i-1) * 4 + 0], imageData.data[(i-1) * 4 + 1], imageData.data[(i-1) * 4 + 2]) : null;
      let rightPixel = i % canvasWidth!=(canvasWidth-1) ? new pixel(i+1 , imageData.data[(i+1) * 4 + 0], imageData.data[(i+1) * 4 + 1], imageData.data[(i+1) * 4 + 2]) : null;
      let topPixel = i > canvasWidth ? new pixel(i-canvasWidth , imageData.data[(i-canvasWidth) * 4 + 0], imageData.data[(i-canvasWidth) * 4 + 1], imageData.data[(i-canvasWidth) * 4 + 2]) : null;
      let bottomPixel = i < canvasWidth * (canvasHeight -1) ? new pixel(i+canvasWidth, imageData.data[(i+canvasWidth) * 4 + 0], imageData.data[(i+canvasWidth) * 4 + 1], imageData.data[(i+canvasWidth) * 4 + 2]) : null;
      
      switch (filter) {
          case 'silh':
          let diff = 9;
          if (leftPixel && rightPixel && topPixel && bottomPixel) {
            let count = (leftPixel.r > myPixel.r+diff? 1:0) + (rightPixel.r > myPixel.r+diff? 1:0) + (topPixel.r > myPixel.r+diff? 1:0) + (bottomPixel.r > myPixel.r+diff? 1:0);
            count += (myPixel.r < 20 && myPixel.g < 20 && myPixel.b < 20 ? 2 : 0 );
            if (count>2){
                dataTemp.data[i * 4 + 0] = 0;
                dataTemp.data[i * 4 + 1] = 0;
                dataTemp.data[i * 4 + 2] = 0;
              }
            else {
                dataTemp.data[i * 4 + 0] = 255;
                dataTemp.data[i * 4 + 1] = 255;
                dataTemp.data[i * 4 + 2] = 255;
            }    
          }
              
              break;
          case 'bw':
            dataTemp.data[i * 4 + 0] = myPixel.r;
            dataTemp.data[i * 4 + 1] = myPixel.r;
            dataTemp.data[i * 4 + 2] = myPixel.r;
            
            break;
          case 'negative':
            dataTemp.data[i * 4 + 0] = 255 - myPixel.r;
            dataTemp.data[i * 4 + 1] = 255 - myPixel.g;
            dataTemp.data[i * 4 + 2] = 255 - myPixel.b;
            
            break;
          case 'test':
          if (leftPixel && rightPixel && topPixel && bottomPixel) {
            let diff = 5;

            dataTemp.data[i * 4 + 0] = myPixel.r + ((myPixel.r > myPixel.g && myPixel.r > myPixel.b) ? 20 : 0);
            dataTemp.data[i * 4 + 1] = myPixel.g + ((myPixel.g > myPixel.b && myPixel.g > myPixel.r) ? 20 : 0);
            dataTemp.data[i * 4 + 2] = myPixel.b + ((myPixel.b > myPixel.r && myPixel.b > myPixel.g) ? 20 : 0);
            }
            
            break;
          default:
              break;
      }
      
    }
    return dataTemp;
}