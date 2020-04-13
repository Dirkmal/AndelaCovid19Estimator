function calcCurrInfected(reportedCases, multFactor) {
  return Math.trunc(reportedCases * multFactor);
}

function estNewInfections(currInfected, days) {
  const factor = Math.trunc(days / 3);

  return Math.trunc(currInfected * (2 ** factor));
}

function severeCases(infections) {
  return Math.trunc(infections * 0.15);
}

function availableBeds(totalBeds, numberOfCases) {
  return numberOfCases - Math.trunc(totalBeds * 0.35);
}

function ICUCases(infections) {
  return Math.trunc(infections * 0.05);
}

function ventilatorCases(infections) {
  return Math.trunc(infections * 0.02);
}

function economicLoss(infections, population, income, period) {
  return Math.trunc(
    (infections * population * income) / period
  );
}

function periodInDays(durationType, period) {
  if (durationType === 'months') {
    return period * 30;
  } else if (durationType === 'years') {
    return period * 12 * 30;
  }
  return period;
}

const covid19ImpactEstimator = (data) => {
  const actualDays = periodInDays(data.periodType, data.timeToElapse);

  const currInfected = calcCurrInfected(data.reportedCases, 10);
  const sevCurrInfected = calcCurrInfected(data.reportedCases, 50);

  const newInfections = estNewInfections(currInfected, actualDays);
  const sevNewInfections = estNewInfections(sevCurrInfected, actualDays);

  const impactSevCases = severeCases(newInfections);
  const sevCases = severeCases(sevNewInfections);

  // hospital_beds = availableBeds(data.totalHospitalBeds, impactSevCases);
  // sevhospital_beds = availableBeds(daa.totalHospitalBeds, sevCases);

  // icu_cases = ICUCases(newInfections);
  // sevicu_cases = ICUCases(sevNewInfections);

  // vent_cases = ventilatorCases(newInfections);
  // sevvent_cases = ventilatorCases(sevNewInfections);

  dollarsLost = economicLoss(
    newInfections,
    data.avgDailyIncomePopulation,
    data.avgDailyIncomeInUSD,
    actualDays);
  sevDollarsLost = economicLoss(
    sevNewInfections,
    data.avgDailyIncomePopulation,
    data.avgDailyIncomeInUSD,
    actualDays);

  return {
    estimate: {
      impact: {
        currentlyInfected: currInfected,
        infectionsByRequestedTime: newInfections,
        severeCasesByRequestedTime: severeCases(newInfections),
        hospitalBedsByRequestedTime: availableBeds(data.totalHospitalBeds, impactSevCases),
        casesForICUByRequestedTime: ICUCases(newInfections),
        casesForVentilatorByRequestedTime: ventilatorCases(newInfections),
        dollarsInFlight: dollarsLost
      },
      severeImpact: {
        currentlyInfected: sevCurrInfected,
        infectionsByRequestedTime: sevNewInfections,
        severeCasesByRequestedTime: severeCases(sevNewInfections),
        hospitalBedsByRequestedTime: availableBeds(daa.totalHospitalBeds, sevCases),
        casesForICUByRequestedTime: ICUCases(sevNewInfections),
        casesForVentilatorByRequestedTime: ventilatorCases(sevNewInfections),
        dollarsInFlight: sevDollarsLost
      }
    }
  }
};

export default covid19ImpactEstimator;
