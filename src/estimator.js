const covid19ImpactEstimator = (data) => {
    const actual_days = periodInDays(data.periodType, data.timeToElapse);

    curr_infected = currInfected(data.reportedCases, 10);
    sev_curr_infected = currInfected(data.reportedCases, 50);

    new_infections = estNewInfections(curr_infected, actual_days);
    sev_new_infections = estNewInfections(sev_curr_infected, actual_days);

    // impact_sev_cases = severeCases(new_infections);
    // sev_cases = severeCases(sev_new_infections);

    // hospital_beds = availableBeds(data.totalHospitalBeds, impact_sev_cases);
    // sev_hospital_beds = availableBeds(daa.totalHospitalBeds, sev_cases);

    // icu_cases = ICUCases(new_infections);
    // sev_icu_cases = ICUCases(sev_new_infections);

    // vent_cases = ventilatorCases(new_infections);
    // sev_vent_cases = ventilatorCases(sev_new_infections);

    dollars_lost = economicLoss(
        new_infections, 
        data.avgDailyIncomePopulation, 
        data.avgDailyIncomeInUSD,
        actual_days);
    sev_dollars_losts = economicLoss(
        sev_new_infections, 
        data.avgDailyIncomePopulation, 
        data.avgDailyIncomeInUSD,
        actual_days);

    return {
        estimate: {
            impact: {
                currentlyInfected: curr_infected,
                infectionsByRequestedTime: new_infections,
                severeCasesByRequestedTime: severeCases(new_infections),
                hospitalBedsByRequestedTime: availableBeds(data.totalHospitalBeds, impact_sev_cases),
                casesForICUByRequestedTime: ICUCases(new_infections),
                casesForVentilatorByRequestedTime: ventilatorCases(new_infections),
                dollarsInFlight: dollars_lost
            },
            severeImpact: {
                currentlyInfected: sev_curr_infected,
                infectionsByRequestedTime: sev_new_infections,
                severeCasesByRequestedTime: severeCases(sev_new_infections),
                hospitalBedsByRequestedTime: availableBeds(daa.totalHospitalBeds, sev_cases),
                casesForICUByRequestedTime: ICUCases(sev_new_infections),
                casesForVentilatorByRequestedTime: ventilatorCases(sev_new_infections),
                dollarsInFlight: sev_dollars_losts
            }
        }
    }
    
};

export default covid19ImpactEstimator;

function currInfected (reported_cases, mult_factor) {
    return Math.trunc(reported_cases * mult_factor);
}

function estNewInfections(curr_infected, days) {
    let factor = Math.trunc(days/3);

    return Math.trunc(curr_infected * Math.pow(2, factor));
}

function severeCases(infections) {
    return Math.trunc(infections * 0.15);
}

function availableBeds(total_beds, number_of_cases) {
    return number_of_cases - Math.trunc(total_beds * 0.35);
}

function ICUCases(infections) {
    return Math.trunc(infections * 0.05)
}

function ventilatorCases(infections) {
    return Math.trunc(infections * 0.02);
}

function economicLoss(infections, population, income, period) {
    return Math.trunc(
        (infections * population * income) / period
    );
}

function periodInDays(period_type, period) {
    if (period_type === "months") {
        period = period * 30;
    } else if (period_type === "years") {
        period = period * 12 * 30;
    }
    return period;
}