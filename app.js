var sax = require("sax");
var fs = require("fs");
var dcopy = require('deep-copy');

var xmlFile = process.argv[2];
var fileSize = determineSize();

var saxStream = require("sax").createStream(true, {position:true});

var bullets = ["•", "○", "■", "▫", "‣", "▹", "-"];
var feed = {};
var percentComplete = 0;

// Display results after completion
saxStream.on("end", function (node) {
  console.log("\n OUTPUT\n <node_name>  <total_nodes> / <total_nodes_with_data>\n  - <random_sample_data>\n")
  outputResults(feed, "", bullets);
});

// Each node gets counted and stored in a JS object tree when seen
saxStream.on("opentagstart", function (node) {
  percentComplete = Math.round(this._parser.startTagPosition/fileSize * 1000.0)/10.0;

  // showing a status to let the user know it's still working
  if (fileSize > 10000000 && this._parser.startTagPosition % 1000000 === 0) {
    showStatus();
  }

  var thisNode = getNode(this._parser.tags);
  thisNode[node.name] = thisNode[node.name] || {totalCount: 0, totalData: 0, sample: []};
  thisNode[node.name].totalCount++;
});

// store meta data and sample cdata text
saxStream.on("cdata", function (text) {
  processText(text, this._parser);
});

// store meta data and sample text
saxStream.on("text", function (text) {
  processText(text, this._parser);
});

function processText (text, parser) {
  var thisNode = getNode(parser.tags);
  thisNode = thisNode[parser.tagName] || thisNode
  text = text.replace(/\n/g, ' ').trim();
  if (thisNode && text.length) thisNode.totalData++;

  // There is probably a better way to do this...
  if (
    thisNode && text.length && (
    (percentComplete > 15 && thisNode.sample.length === 0) ||
    (percentComplete > 30 && thisNode.sample.length === 1) ||
    (percentComplete > 45 && thisNode.sample.length === 2) ||
    (percentComplete > 60 && thisNode.sample.length === 3) ||
    (percentComplete > 75 && thisNode.sample.length === 4))
  ) {
    if (text.length > 100) text = text.substr(0, 97) + '...';
    thisNode.sample.push(text);
  }
}

function getNode(feedTracker) {
  var nodeName;
  feedTracker.forEach(function (item,i) {
    if (i === 0) nodeName = feed;
    nodeName = nodeName[item.name];
  });

  return nodeName || feed;
}

function showStatus () {
  console.log("Still processing:", percentComplete + '%', ' processed.');
}

function outputResults(obj, indent, bullets) {
  var bullet = bullets[0];
  indent = indent || ""

  Object.keys(obj).forEach(function(key,index) {
    if (!Array.isArray(obj[key]) && typeof obj[key] === "object") {
      var newBullets = dcopy(bullets);
      newBullets.shift();
      console.log(`${indent} ${bullet} ${key}  ${obj[key].totalCount} / ${obj[key].totalData}`)
      outputResults(obj[key], (indent + "  "), newBullets);

    } else if (Array.isArray(obj[key]) && obj[key].length) {
      console.log(`${indent} - ${obj[key].join("\n" + indent + " - ")}`)
    }

  });
}

function determineSize () {
  var stats = fs.statSync(xmlFile);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

//Stream the file
fs.createReadStream(xmlFile)
  .pipe(saxStream);
