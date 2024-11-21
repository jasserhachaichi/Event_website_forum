let defaultday = 1;

function checkDate(input) {
  const blockedDates = [];

  const listItems = document.querySelectorAll('#dateList li[data-date]'); // Select all 'li' with 'data-date' attribute

  listItems.forEach(li => {
    blockedDates.push(li.getAttribute('data-date'));
  });

  if (blockedDates.includes(input.value)) {
    alert("Cette date a été sélectionné.");
    input.value = ''; // Resets the input if the selected date is blocked
    return false;
  }

}

function DaysCount() {
  var dateList = document.getElementById("dateList");
  var selectElement = document.getElementById("jour");

  // Check if elements with specified IDs exist
  if (dateList && selectElement) {
    selectElement.innerHTML = '';
    var numberOfChildren = dateList.children.length;

    // Loop from 0 to numberOfChildren - 1 and insert options
    for (var i = 0; i < numberOfChildren; i++) {
      // Create a new option element
      var option = document.createElement("option");

      // Set the value and text content of the option
      option.value = i + 1; // If you want options to start from 1
      option.textContent = i + 1;

      // Append the option to the select element
      selectElement.appendChild(option);
    }
  } //else {
    //console.error("Elements with specified IDs not found.");
  //}

}


// Comparator function for sorting dates
function dateComparator(a, b) {
  const dateA = new Date(a.getAttribute('data-date'));
  const dateB = new Date(b.getAttribute('data-date'));
  return dateA - dateB;
}

// This function will add a new date to the list
function addDate() {
  var dateInput = document.getElementById('newDate').value;
  if (dateInput) {
    var date = new Date(dateInput);
    const list = document.getElementById('dateList');

    // Create the new list item
    var li = document.createElement('li');
    li.setAttribute('ID-tab', (list.querySelectorAll('li').length + 1).toString());
    li.setAttribute('data-date', dateInput);
    li.setAttribute('onclick', "changeSelectedDay(this)");
    li.setAttribute('data-link', '#section-services-tab');
    li.innerHTML = `
    <h3>Jour <span></span></h3>
    <h4>${date.toLocaleDateString()}</h4>
    <i class="fa-solid fa-trash" onclick="removeDate(this)"></i>`;

    const contentContainer = document.querySelector('.de_tab_content');

    // Create the new tab content section
    var contentSection = document.createElement('div');
    contentSection.id = 'tab' + (list.querySelectorAll('li').length + 1).toString(); // Adjust id to match your tab number system
    contentSection.className = 'tab_single_content';
    //contentSection.innerHTML = '<div class="row"><div class="col-md-12">' + date.toLocaleDateString() + '</div></div>';
    contentSection.innerHTML = '<div class="row"><div class="col-md-12"><div class="schedule-listing"></div></div></div>';

    contentContainer.appendChild(contentSection);


    list.appendChild(li);

    // Sort the list based on date
    let sortedList = Array.from(list.getElementsByTagName('li'));
    sortedList.sort(dateComparator);


    // Empty the list and append sorted items
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    sortedList.forEach(function (li) {
      list.appendChild(li);
    });


    updateDayNumbers(); // Update the day counter after appending all sorted items


    // Hide modal after adding new date
    $('#AddDateModal').modal('hide');
    document.getElementById('newDate').value = ''; // Reset the input field
  } else {
    var errorMsgElement = document.getElementById('errorMsg');
    errorMsgElement.innerText = "Veuillez sélectionner une date.";
    errorMsgElement.style.display = "block";
  }
}





// Function to update day numbers or display 'Empty' if no dates
function updateDayNumbers() {
  const list = document.getElementById('dateList');
  var listItems = list.querySelectorAll("li");

  if (listItems.length === 0) {
    list.textContent = "Aucune date prévue. Cliquez sur le bouton '+' pour ajouter un nouveau jour.";
  }
  else {
    const contentContainer = document.querySelector('.de_tab_content');
    var sortedItems = document.createDocumentFragment(); // Create a document fragment to hold sorted items
    if (listItems.length === 1) {
      setDefaultActiveDay(1);
    }
    // If the list is not empty, update day numbers and ID-tab attributes
    Array.from(listItems).forEach((li, newIndex) => {
      var oldIndex = parseInt(li.getAttribute('ID-tab'));
      var contentContainerItems = contentContainer.querySelectorAll(`.tab_single_content[id='tab${oldIndex}']`)[0].cloneNode(true);
      // Check if the 'active' class exists on the current list item
      var isActive = li.classList.contains('active');

      li.setAttribute('ID-tab', (newIndex + 1).toString()); // Update ID-tab to new index
      contentContainerItems.setAttribute('id', "tab" + (newIndex + 1).toString());
      sortedItems.appendChild(contentContainerItems);
      li.getElementsByTagName('span')[0].textContent = (newIndex + 1).toString();


      if (isActive) {
        setDefaultActiveDay(newIndex + 1);
        contentContainerItems.style.display === "block";
      } else {
        contentContainerItems.style.display = "none";
      }
    });

    // Remove all child nodes from contentContainer
    while (contentContainer.firstChild) {
      contentContainer.removeChild(contentContainer.firstChild);
    }

    // Append sorted items to contentContainer
    contentContainer.appendChild(sortedItems);
  }
}

function changeSelectedDay(clickedElement) {
  const dateList = document.getElementById('dateList');

  // Check if the clicked element is an <li>
  var clickedLI = clickedElement.closest('li');

  if (clickedLI) {
    // Remove 'active' class from all <li> children
    Array.from(dateList.children).forEach((child) => {
      child.classList.remove('active');
    });

    // Hide all content elements
    var contentContainerItems = document.querySelectorAll(`.tab_single_content`);
    contentContainerItems.forEach((elm) => {
      elm.style.display = "none"; // Corrected from 'elm.style.display === "none";'
    });

    // Get the clicked day index
    const clickedDayIndex = clickedLI.getAttribute('ID-tab');
    if (clickedDayIndex) {
      defaultday = clickedDayIndex; // Assuming this is meant to track the current active day

      // Add 'active' class to the clicked <li>
      clickedLI.classList.add('active');

      // Show the content for the clicked day
      var contentclickedItem = document.getElementById(`tab${clickedDayIndex}`);
      if (contentclickedItem) {
        contentclickedItem.style.display = "block"; // Corrected from 'contentclickedItem.style.display === "none";'
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  const dateList = document.getElementById('dateList');

  // Delegate click event to the dateList
  dateList.addEventListener('click', function (e) {
    changeSelectedDay(e.target);
  });
});

function removeDate(element) {
  // Assuming 'element' is the trash icon inside the li that has an onclick event attached directly
  // Prevent the event from affecting parent elements
  event.stopPropagation();

  // Identify the parent 'li' element which is the actual date item
  var listItem = element.closest('li');

  // Check if the current date is active
  var isActive = listItem.classList.contains('active');

  // Retrieve the tab id
  var tabId = listItem.getAttribute('ID-tab');

  // Remove the list item
  listItem.remove();

  // Remove the associated tab content
  var contentSection = document.getElementById('tab' + tabId);
  if (contentSection) {
    contentSection.remove();
  }

  // If the removed day was active, set the first day as default active
  if (isActive) {
    setDefaultActiveDay(1);
  }

  // Sort the list and update day numbers
  updateDayNumbers(); // Assuming this function is defined and re-sorts the day tabs
}



function setDefaultActiveDay(dayNumber) {
  // Remove 'active' class from all <li> children
  const listItems = document.querySelectorAll("#dateList li");
  listItems.forEach(li => li.classList.remove('active'));

  // Hide all tab content
  const contentSections = document.querySelectorAll(".de_tab_content .tab_single_content");
  contentSections.forEach((section) => {
    section.style.display = "none"; // Hide the content section
  });

  // Add 'active' class to the default day and show corresponding tab content
  const defaultDayLi = document.querySelector(`#dateList li[ID-tab="${dayNumber}"]`);
  if (defaultDayLi) {
    defaultDayLi.classList.add('active');
    // Show only the tab content that corresponds to the 'active' day
    const activeSection = document.getElementById("tab" + dayNumber);
    if (activeSection) {
      activeSection.style.display = "block"; // Show the content section
      defaultday = dayNumber;
    }
  } else {
    // If there is no element with the id-tab equal to the dayNumber this part of the code will run
    //console.log(`No tab with ID-tab="${dayNumber}" found.`);
  }
}


