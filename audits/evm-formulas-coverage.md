# EVM Formulas Coverage Audit

Source PDFs:
- `EVMFormulasfor+Exam.pdf`
- `EVM+Formulas+for+Exam.pdf`

Both files are byte-identical (`sha256: fbadc0ce14985c60655e0132de0faffb565b0d1022941f95da868f3ec0813ccb`), so this audit treats them as one source deck.

## Summary

- Source pages audited: 1/1
- Page coverage: 1/1 covered
- Formula coverage: complete for the slide's EVM memorization table
- Primary cheat sheet location: `sections/formulas-frameworks.html#evm`
- Supporting process location: `sections/processes/cost.html` under `Control Cost`

## Corrections Applied

- Clarified that favorable/unfavorable variance wording applies to `CV` and `SV`.
- Clarified that `> 1 favorable, < 1 unfavorable` wording applies to `CPI` and `SPI`, not every index.
- Added explicit `TCPI =` labels in both TCPI formulas.
- Reworded TCPI guidance so `TCPI > 1` means the remaining work must be performed more efficiently, therefore it is harder.
- Strengthened `Control Cost` wording to favor root-cause analysis and corrective action instead of blindly cutting cost.
- Added the adjusted-EAC TCPI variant in the cost process reference: `TCPI = (BAC - EV) / (EAC - AC)`.

## Formula Matrix

| Slide Item | Meaning Tested | Formula / Rule | Covered In | Status |
|---|---|---|---|---|
| `BAC` | Original approved project budget | No formula; original budget | `sections/formulas-frameworks.html#evm`, `sections/processes/cost.html` | Covered |
| `PV` | Value of planned work by status date | `PV = planned % complete x BAC` | `sections/formulas-frameworks.html#evm` | Covered |
| `EV` | Value of work actually completed | `EV = actual % complete x BAC` | `sections/formulas-frameworks.html#evm` | Covered |
| `AC` | Actual amount already spent | No formula; actual cost recorded | `sections/formulas-frameworks.html#evm`, `sections/processes/cost.html` | Covered |
| `CV` | Cost variance | `CV = EV - AC`; positive under budget, negative over budget | `sections/formulas-frameworks.html#evm`, `sections/processes/cost.html` | Covered |
| `CPI` | Cost performance efficiency | `CPI = EV / AC`; `>= 1` favorable, `< 1` unfavorable | `sections/formulas-frameworks.html#evm`, `sections/processes/cost.html` | Covered |
| `SV` | Schedule variance in earned value terms | `SV = EV - PV`; positive ahead, negative behind | `sections/formulas-frameworks.html#evm`, `sections/processes/schedule.html`, `sections/schedule-cpm.html` | Covered |
| `SPI` | Schedule performance efficiency | `SPI = EV / PV`; `>= 1` favorable, `< 1` unfavorable | `sections/formulas-frameworks.html#evm`, `sections/processes/schedule.html`, `sections/schedule-cpm.html` | Covered |
| `EAC` | Forecast total cost at completion based on current spending rate | `EAC = BAC / CPI` | `sections/formulas-frameworks.html#evm`, `sections/processes/cost.html` | Covered |
| `ETC` | Forecast cost needed to finish remaining work | `ETC = EAC - AC` | `sections/formulas-frameworks.html#evm`, `sections/processes/cost.html` | Covered |
| `VAC` | Difference between original budget and forecast final cost | `VAC = BAC - EAC`; positive favorable, negative unfavorable | `sections/formulas-frameworks.html#evm`, `sections/processes/cost.html` | Covered |
| `TCPI` | Required performance for remaining work to finish within budget | `TCPI = (BAC - EV) / (BAC - AC)` | `sections/formulas-frameworks.html#evm`, `sections/processes/cost.html` | Covered |

## Page Matrix

| Page | Slide Focus | Coverage Location | Status |
|---:|---|---|---|
| 1 | EVM formula memorization table: BAC, PV, EV, AC, CV, CPI, SV, SPI, EAC, ETC, VAC, TCPI | `sections/formulas-frameworks.html#evm`; reinforced in `sections/processes/cost.html` | Covered |

## Notes

- The cheat sheet includes extra exam-useful EAC and TCPI variants beyond this one-page slide. Those do not conflict with the source slide; they help answer PMP questions that state a different forecasting assumption.
- This audit only certifies the EVM formulas slide deck, not the entire PMP body of knowledge.
