function buildThresholdList (numSteps = 10) {
  let thresholds = [];

  for (let i = 1; i <= numSteps; i++) {
    let ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}

window.buildThresholdList = buildThresholdList;