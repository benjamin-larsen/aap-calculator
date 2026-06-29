import type BigNumber from "bignumber.js";

export interface TaxBracket {
  rate: BigNumber;
  minimum: BigNumber;
}

export interface TaxRate {
  rate: BigNumber;
  limit: BigNumber;
}

export interface TaxRates {
  /*
    Minimum Standrard Deduction (Minstefradrag)
    - Minstefradraget er et standardfradrag som automatisk trekkes fra lønn og pensjon, og som skal dekke de fleste kostnadene du har hatt knyttet til arbeid.
  */
  minimumStandardDeduction: TaxRate;

  /*
    Personal Allowance (Personfradrag)
    - Personfradrag er et generelt bunnfradrag i alminnelig inntekt, det vil si at det gis i alle inntekter (lønns-, pensjons-, kapital- og næringsinntekter).
  */
  personalAllowance: BigNumber;

  /*
    National Insurance contributions (Trygdeavgift)
    - Trygdeavgiften er med på å finansiere folketrygden. Trygdeavgiften beregnes automatisk som en del av personinntekten.
  */
  welfareTax: TaxRate;

  /*
    General income (Alminnelig inntekt)
    - Alminnelig inntekt er en nettoinntekt og skal beregnes av alle skattepliktige, både personer og selskaper. Alle typer skattepliktige inntekter, med fradrag for alle fradragsberettigede kostnader, omfattes.
  */
  commonTax: BigNumber;

  /*
    Bracket tax (Trinnskatt)
    - Trinnskatten er en progressiv skatt på brutto lønn og annen personinntekt. Trinnskatt til staten ble innført fra og med inntektsåret 2016 og erstatter tidligere "toppskatt" på høye inntekter.
  */
  taxBrackets: TaxBracket[];
}