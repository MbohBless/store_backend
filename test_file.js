// generate a list of colors 


// generate a list of 20 color hexcodes with light shdes
const generateColors = () => {
    let colors = []
    for (let i = 0; i < 20; i++) {
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        colors.push(color)
    }
    return colors
}  