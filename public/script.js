function renderMealplans() {
    $("#weeks").empty();
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
            // FORM TO ADD NEW MEALS TO THE WEEK
            const newForm = $("<form>", {
                id: plan._id
            })
            const newBtn = $("<button>", {
                text: 'Add meal...',
                class: 'update-btn',
                'data-id': plan._id
            })
            const nameInput = $("<input>", {
                type: 'text', 
                id: `name-${plan._id}`,
                placeholder: 'New meal name..'
            })
            const servLabel = $("<label>", {
                for: `serving-${plan._id}`,
                text: 'Number of servings: '
            })
            const servingInput = $("<input>", {
                type: 'number', 
                id: `serving-${plan._id}`
            })
            const tastyLabel = $("<label>", {
                for: `tasty-${plan._id}`,
                text: 'Is it tasty? Click if true.'
            })
            const tastyInput = $("<input>", {
                type: 'checkbox', 
                id: `tasty-${plan._id}`
            })
            const hotdogLabel = $("<label>", {
                for: `hotdog-${plan._id}`,
                text: 'Is it hotdog? Click if true.'
            })
            const hotdogInput = $("<input>", {
                type: 'checkbox', 
                id: `hotdog-${plan._id}`
            })
            const spicyLabel = $("<label>", {
                for: `spicy-${plan._id}`,
                text: 'How spicy is it??'
            })
            const spicyInput = $("<input>", {
                type: 'number', 
                id: `spicy-${plan._id}`
            })
            
            newForm
            .append(nameInput)
            .append(servLabel)
            .append(servingInput)
            .append(tastyLabel)
            .append(tastyInput)
            .append(hotdogLabel)
            .append(hotdogInput)
            .append(spicyLabel)
            .append(spicyInput)
            .append(newBtn)
            
            newDiv
            .append(newUl)
            .append(newForm);


            $("#weeks").append(newDiv);
        })  
    })
}
renderMealplans();

$("#new-week").on('submit', (e)=>{
    e.preventDefault();
    const weekname = $("#week-name").val().trim();
    console.log(weekname);
    $.ajax({
        url: "/api/weeks",
        method: "POST",
        data: {name: weekname}
    })
    .then(renderMealplans())
})

$("#weeks").on('click', ".update-btn",(e)=>{
    e.preventDefault();
    const weekId = e.target.dataset.id;
    console.log(weekId);
    const name = $(`#name-${weekId}`).val().trim();
    const servings = parseInt($(`#serving-${weekId}`).val())
    const isTasty = $(`#tasty-${weekId}`).is(":checked");
    const isHotDog = $(`#hotdog-${weekId}`).is(":checked");
    const spicyLevel = parseInt($(`#spicy-${weekId}`).val());

    const newObj = {
        name, servings, isTasty, isHotDog, spicyLevel, weekId
    }

    console.log(newObj);

    $.ajax({
        url: "/api/meals",
        method: "POST",
        data: newObj
    })
    .then(dbMeals => {
        console.log(dbMeals)
        renderMealplans();
    })
    .catch(err => {
        console.log(err);
    })

})