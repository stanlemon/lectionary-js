# Missing Non-Sunday Observances in the 3-Year Lectionary

These observances exist in `lsb-1yr.json` but were absent from all three
series files (`lsb-3yr-a.json`, `lsb-3yr-b.json`, `lsb-3yr-c.json`) and
from `lsb-festivals.json`. Each entry shows its data-model identifier
(week + weekday, or fixed month/day).

| Observance | Identifier |
|---|---|
| Ash Wednesday | week 15, day 3 |
| Monday of Holy Week | week 21, day 1 |
| Tuesday of Holy Week | week 21, day 2 |
| Wednesday of Holy Week | week 21, day 3 |
| Maundy Thursday (Holy Thursday) | week 21, day 4 |
| Good Friday | week 21, day 5 |
| Holy Saturday (Easter Vigil) | week 21, day 6 |
| Easter Evening / Monday | week 22, day 1 |
| Easter Tuesday | week 22, day 2 |
| Easter Wednesday | week 22, day 3 |
| Ascension | week 27, day 4 |
| Pentecost Evening / Monday | week 29, day 1 |
| Pentecost Tuesday | week 29, day 2 |
| Christmas Eve | month 12, day 24 |
| Christmas Day | month 12, day 25 |
| The Epiphany of Our Lord | month 1, day 6 |

## Status

| Series | Added | Source |
|---|---|---|
| A | ✓ | *Lutheran Service Book* Three-Year Lectionary pp. xiv–xv |
| B | pending | |
| C | pending | |

## Notes

- **Maundy Thursday** has two sets of readings in Series A (primary: Ex. 24 /
  Heb. 9 / Matt. 26; alternate: Ex. 12 / 1 Cor. 11 / John 13). Only the
  primary set is stored; the alternate matches the 1-year LSB readings.
- **Christmas**: Only Christmas Eve (Dec 24) and Christmas Day (Dec 25) are
  stored. The Dec 25 entry uses the Christmas Day (principal daytime) service
  readings. Christmas Midnight and Christmas Dawn services are not separately
  addressable in the current data model.
- **Holy Week gospels**: Several days list two options ("or …"); only the
  first/primary option is stored.
- **Easter Wednesday** second reading is stored as `Col. 3:1-7` (the first of
  two options).
- These readings are the same across all three series (A/B/C) for these
  special days, so once B and C files are updated they should use identical
  entries.
