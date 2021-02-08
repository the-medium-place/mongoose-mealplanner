function renderMealplans() {
    $("#week").empty();
    $.ajax({
        url: "/populatedmeals",
        method: "GET",
    })
    .then(dbData => {
        console.log(dbData)
        dbData.forEach(plan => {
            // make a new div each workout
            const newDiv = $("<div>", {
                style: 'width: 25%; border: 2px solid blue',
            })
            const title = $("<h3>", {
                text: plan.name
            })
            const newUl = $("<ul>", {text: 'MEALS!!'})
            newDiv.append(title)


            // loop through meals and print each
            plan.meals.forEach(meal=>{
                const newLi = $("<li>",{
                    text:`Name: ${meal.name}\nServes: ${meal.servings}\nTasty: ${meal.isTasty ? 'Yes it is!':'No it isn\'t!'}\nIs it a hotdog? ${meal.isHotDog ? "Yes it is!":"No it isnt!"}\nSpiciness: ${meal.spicyLevel}`
                })
                newUl.append(newLi);
            })
            newDiv.append(newUl);
            $("#weeks").append(newDiv);
        })  
    })
}
renderMealplans();