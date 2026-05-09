//------------------------------------------
//            INITIATION CANVAS
//------------------------------------------
let canvasStarted = false;
let canvas;
let ctx;

export function initRomanCanvas() {
    canvas = document.getElementById("romanCanvas");
    if (!canvas) return false;

    ctx = canvas.getContext("2d");
    return true;
}

//------------------------------------------
//            ANIMATION CANVAS
//------------------------------------------


export const romans = [
    { r: "I", n: 1 },
    { r: "II", n: 2 },
    { r: "III", n: 3 },
    { r: "IV", n: 4 },
    { r: "V", n: 5 },
    { r: "VI", n: 6 },
    { r: "VII", n: 7 },
    { r: "VIII", n: 8 },
    { r: "IX", n: 9 },
    { r: "X", n: 10 },
    { r: "L", n: 50 },
    { r: "C", n: 100 },
    { r: "D", n: 500 },
    { r: "M", n: 1000 }
];

let offset = 400;

export function draw() {
    if (!ctx || !canvas) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Style global
    ctx.font = "25px monospace";
    ctx.textBaseline = "middle";

    const y = canvas.height / 2;
    let x = offset;

    romans.forEach((item, index) => {
        const text = `${item.r} = ${item.n}`;
        const separator = " | ";

        // ---- TEXTE PRINCIPAL ----
        ctx.fillStyle = "green";
        ctx.shadowBlur = 0; // reset shadow
        ctx.fillText(text, x, y);

        const textWidth = ctx.measureText(text).width;
        x += textWidth + 10;

        // ---- SEPARATEUR (sauf dernier) ----
        if (index < romans.length - 1) {
            ctx.fillStyle = "red";
            ctx.shadowColor = "darkred";
            ctx.shadowBlur = 6;

            ctx.fillText(separator, x, y);

            const sepWidth = ctx.measureText(separator).width;
            x += sepWidth + 10;

            ctx.shadowBlur = 0; // reset après effet
        }
    });

    // ---- SCROLL ----
    offset -= 0.6;

    // Calcul largeur totale pour reset propre
    let totalWidth = 0;
    romans.forEach((item, index) => {
        const text = `${item.r} = ${item.n}`;
        totalWidth += ctx.measureText(text).width;

        if (index < romans.length - 1) {
            totalWidth += ctx.measureText(" | ").width + 20;
        }
    });

    if (offset < -totalWidth) {
        offset = canvas.width;
    }

    requestAnimationFrame(draw);
}