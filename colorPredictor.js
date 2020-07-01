// var r, g, b;
// r = new Array();
// g = new Array();
// b = new Array();

// var datalen = 100; //length of total data used

// //making data for training
// for (let i = 0; i < datalen; i++) {
//   r[i] = Math.floor(Math.random() * 256);
//   g[i] = Math.floor(Math.random() * 256);
//   b[i] = Math.floor(Math.random() * 256);
//   console.log("(" + i + ")" + r[i] + "," + g[i] + "," + b[i]);
// }

// //grouping the r, b, g values in 500*3 matrix

// var y = new Array();
// for (i = 0; i < datalen; i++) {
//   y.push([r[i], g[i], b[i]]);
// }

// //grouping data into training, test and cross-validation
// var trainingdata = tf.tensor2d(y.slice(0, (datalen * 60) / 100));
// var cvdata = tf.tensor2d(y.slice((datalen * 60) / 100, (datalen * 80) / 100));
// var testdata = tf.tensor2d(y.slice((datalen * 80) / 100, datalen));
// trainingdata.print();
// cvdata.print();
// testdata.print();

//get the target data

/* **************************************************************** */

//creating neural network
const model = tf.sequential();

const hiddenLayer1 = tf.layers.dense({
  inputShape: [3],
  activation: "sigmoid",
  units: 5,
});
const hiddenLayer2 = tf.layers.dense({
  activation: "sigmoid",
  units: 5,
});
const outputLayer = tf.layers.dense({
  activation: "sigmoid",
  units: 2,
});

model.add(hiddenLayer1);
model.add(hiddenLayer2);
model.add(outputLayer);

//find either white font or black font is selected
var selected;
var check = 20;
var whitePalette = document.getElementById("white-palette");
var blackPalette = document.getElementById("black-palette");
var c = 1;
var tag, text, element;
whitePalette.addEventListener("click", () => {
  //animate palette
  whitePalette.style.position = "relative";
  whitePalette.style.top = "10px";
  whitePalette.style.right = "5px";
  whitePalette.style.boxShadow = "2px 2px 15px rgb(33, 34, 39)";
  setTimeout(function () {
    whitePalette.style.top = "0px";
    whitePalette.style.right = "0px";
    whitePalette.style.boxShadow = "-30px 30px 15px rgb(33, 34, 39)";
  }, 100);

  // other functionality
  selected = "white";
  tag = document.createElement("div");
  text = document.createTextNode(c + ") white");
  tag.appendChild(text);
  element = document.getElementById("display-body");
  element.appendChild(tag);
  select();
  c = c + 1;
});
blackPalette.addEventListener("click", () => {
  //animate palette
  blackPalette.style.position = "relative";
  blackPalette.style.top = "10px";
  blackPalette.style.right = "5px";
  blackPalette.style.boxShadow = "2px 2px 15px rgb(33, 34, 39)";
  setTimeout(function () {
    blackPalette.style.top = "0px";
    blackPalette.style.right = "0px";
    blackPalette.style.boxShadow = "-30px 30px 15px rgb(33, 34, 39)";
  }, 100);

  // other functionality
  selected = "black";
  tag = document.createElement("div");
  text = document.createTextNode(c + ") black");
  tag.appendChild(text);
  element = document.getElementById("display-body");
  element.appendChild(tag);
  select();
  c = c + 1;
});
function select() {
  if (check > 0) {
    gettarget();
  } else {
    console.log("training over");
    check = 0;
    console.log(target);
  }
  check = check - 1;
  console.log(check);
}
//training
const opt = tf.train.sgd(1.5); //optimizer function for training
model.compile({
  loss: "meanSquaredError",
  optimizer: opt,
});
var target = new Array();
var x, y, z;
x = Math.floor(Math.random() * 256);
y = Math.floor(Math.random() * 256);
z = Math.floor(Math.random() * 256);

whitePalette.style.background = "rgb(" + x + "," + y + "," + z + ")";
blackPalette.style.background = "rgb(" + x + "," + y + "," + z + ")";
var inp = new Array();
function gettarget() {
  if (selected === "white") {
    target.push([1, 0]);
  } else {
    target.push([0, 1]);
  }
  inp.push([x / 255, y / 255, z / 255]);
  console.log(inp);
}
var trainingdata;

// var trainingdata = tf.tensor(t);

var train = document.getElementById("train").addEventListener("click", train);

function train() {
  var description = document.getElementById("description");
  description.innerHTML = "Training...";
  trainingdata = tf.tensor(inp);
  trainingdata.print();
  console.log(inp);

  var trainingtarget = tf.tensor(target);
  trainingtarget.print();

  model.fit(trainingdata, trainingtarget, { epochs: 5000 }).then((response) => {
    console.log(response.history.loss[0]);
    description.innerHTML = "Training finished";
  });
}

//randomly set values of the palettes

//change color
const change = () => {
  x = Math.floor(Math.random() * 256);
  y = Math.floor(Math.random() * 256);
  z = Math.floor(Math.random() * 256);
  whitePalette.style.background = "rgb(" + x + "," + y + "," + z + ")";
  blackPalette.style.background = "rgb(" + x + "," + y + "," + z + ")";
  document.getElementById("select-black").style.visibility = "hidden";
  document.getElementById("select-white").style.visibility = "hidden";
};
document.getElementById("next").addEventListener("click", change);

//predict
var predict = document.getElementById("predict");
predict.addEventListener("click", feedforward);
function feedforward() {
  const input = tf.tensor([[x / 255, y / 255, z / 255]]);
  const output = model.predict(input).dataSync();
  if (output[0] > output[1]) {
    document.getElementById("select-white").style.visibility = "visible";
    document.getElementById("select-black").style.visibility = "hidden";
    console.log("white");
  } else {
    document.getElementById("select-black").style.visibility = "visible";
    document.getElementById("select-white").style.visibility = "hidden";
    console.log("black");
  }
}
var display = document.getElementById("display");
var show = false;
display.addEventListener("click", () => {
  if (show == false) {
    display.style.height = "500px";
    display.style.overflow = "auto";
    show = true;
  } else {
    display.style.height = "200px";
    display.style.overflow = "hidden";
    show = false;
  }
});
//animate button
