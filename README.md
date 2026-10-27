# WeChoose — Complete Service Prototype V2.0

A friend-to-friend shopping service demonstrated through two private phone interfaces and a shared supermarket self-checkout.

## Open

V2.0 is available on GitHub Pages under the original `yehaoy-lang/wechoose-demo` repository. Use the demo home below to enter the complete journey.

- [Demo home](https://yehaoy-lang.github.io/wechoose-demo/demo.html)
- [Private preparation](https://yehaoy-lang.github.io/wechoose-demo/prepare.html?player=A)
- [Choose and scan](https://yehaoy-lang.github.io/wechoose-demo/index.html?view=aisle&campaign=lays)
- [Shared self-checkout](https://yehaoy-lang.github.io/wechoose-demo/checkout.html)

The demo home includes a confirmed shortcut to load a checkout-ready example and a separate Lay’s Q2 preview. These replace the current browser-local game only after confirmation.

## Connected journey

1. Each player privately saves a small wish and a challenge flavour, with an optional shared hint.
2. Each chooses five products for the other person and separately prepares a possible final punishment. The original phone layout and five-pack Lay’s campaign composition are retained.
3. Both submit. The shared checkout reveals ten normal selections one at a time, product first and answer second.
4. Q2 awards the chooser one point for matching the recipient’s locked flavour. Q3 awards the recipient one point for guessing the chooser’s locked motive. Each player can earn up to two points. Q1 wish matching remains under review and is not automatically scored; Q4 and Q5 invite conversation.
5. The final score is explicitly announced before the winner may reveal their extra item. A tie skips punishment. Either participant may keep the challenge voluntary. Revealing or accepting a challenge does not automatically buy the product.
6. Review retained items, return unwanted ones, add ordinary groceries, and show separate A/B bill totals. Only an explicitly selected, revealed punishment item can be purchased. Demo payment produces a fixed sample receipt.

## Reward assumptions

Model B is demonstrated using a completion discount plus a bonus for each person’s own points. The example defaults to 5% plus 2% per point, adjustable on the demo home before revealing begins. All prices, rates, product eligibility and per-person settlement are illustrative assumptions for discussion, not agreed retail terms or actual offers.

## Presentation mode

Self-checkout uses a portrait 3:4 concept touchscreen rather than a phone. “Kiosk view” hides explanatory context and enlarges the shared display. It is an illustrative screen proportion, not a manufacturer’s engineering specification.

## Local use

Serve this folder with any static HTTP server and open `demo.html`. The separately packaged Windows edition also includes `Open_WeChoose.cmd` for launching with Python installed. Keep assets and fonts beside the pages. Relative paths also support the `/wechoose-demo/` GitHub Pages subpath.

## Prototype boundaries

A/B phones and kiosk share local storage in one browser on the same origin. This does not provide real multi-device pairing, account security, camera scanning, stock data, POS integration or payment processing. Separate computers can each open the public website, but their games do not synchronise with each other.

Lay’s is an illustrative collaboration, not a confirmed partnership. Product photographs are real product references; no current local availability is implied. Sources are recorded in `Photo_Sources.json`. Font licensing is included in `assets/fonts/OFL.txt`; third-party brand artwork remains with its respective rights holders.
