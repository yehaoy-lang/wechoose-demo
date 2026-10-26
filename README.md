# WeChoose

An interactive prototype of a friend-to-friend shopping service in a physical retail setting.

This demonstration covers Sector 2: choosing real products for a friend, recording a selection, keeping it secret, and moving to the checkout reveal. The interface and presentation content are in English.

## Open the prototype

- [Lay's edition](https://yehaoy-lang.github.io/wechoose-demo/?view=aisle&campaign=lays)
- [Lay's question preview](https://yehaoy-lang.github.io/wechoose-demo/?view=aisle&campaign=lays&preview=question)
- [Daily edition](https://yehaoy-lang.github.io/wechoose-demo/?view=aisle&campaign=daily)
- [Floor plan entry](https://yehaoy-lang.github.io/wechoose-demo/)

## Demo scope

The prototype simulates two phones in one browser. Scan actions use a simulated product picker. Progress is stored in that browser's local storage. It does not connect to live store inventory, process payments, or synchronise separate devices.

Each player makes five normal selections and prepares one separate possible punishment item. The punishment is outside the five questions and adds no points. Selections stay hidden during this sector; checkout reveal and scoring belong to the next service stage.

## Hosting

Buildless HTML, CSS and JavaScript. GitHub Pages serves the repository root from the main branch. All runtime assets use relative URLs so the project works below /wechoose-demo/.

For local review, serve this folder with a static HTTP server and open index.html.

## Product references

The Lay's edition is an illustrative partnership concept, not an announced or confirmed collaboration. Product pack imagery belongs to its respective rights holders. The referenced products are US product examples; current China availability is not implied. Source URLs are recorded in Photo_Sources.json and accessible through the prototype's Photo sources control.

Font licensing is included in assets/fonts/OFL.txt. No general licence for third-party brand artwork is granted by this repository.
