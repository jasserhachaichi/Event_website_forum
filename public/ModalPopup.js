

function deleteImage(btn) {
  var imageContainer = btn.parentNode;
  imageContainer.parentNode.removeChild(imageContainer);
}



function dragOver(e) {
  e.preventDefault();
  const dragArea = e.target.closest('.drag-area');
  dragArea.classList.add('dragging');
}

function dragLeave(e) {
  const dragArea = e.target.closest('.drag-area');
  dragArea.classList.remove('dragging');
}

function drop(e, num) {
  e.preventDefault();
  const dragArea = e.target.closest('.drag-area');
  dragArea.classList.remove('dragging');
  var text = '';
  if (num == 2) { text = text + "-2" }
  displayFile(e.dataTransfer.files[0], dragArea.parentNode.id, ".InputH" + num, text);
}
var filerobotImageEditor;
const { TABS, TOOLS } = FilerobotImageEditor;
const config = {
  annotationsCommon: {
    fill: '#ff0000',
  },
  Rotate: { angle: 90, componentType: 'slider' },
  //autoResize: true,


  tabsIds: [TABS.ADJUST, TABS.FINETUNE, TABS.FILTERS, TABS.WATERMARK, TABS.ANNOTATE, TABS.RESIZE],
  defaultTabId: TABS.CROP,
  defaultToolId: TOOLS.CROP,

};
config.disableZooming = true;
config.disableRequestName = true;
function displayFile(file, ParentID, inputClass, text) {

  let fileType = file.type;
  let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
  let organisationError = document.getElementById("organisation-error" + text);
  let organisationSuccess = document.getElementById("organisation-sucess" + text);

  if (validExtensions.includes(fileType)) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      var newDivU = document.createElement('div');
      newDivU.className = 'logoOrg';
      var Box_Logos = document.getElementById(ParentID);

      let fileURL = fileReader.result;
      let imgTag = `<img src="${fileURL}" onclick="initializeImageEditor(this)" alt="Logo">`;
      newDivU.innerHTML = imgTag;

      var iElement = document.createElement("i");
      iElement.className = "fa-solid fa-xmark";
      iElement.onclick = function () {
        deleteImage(this);
      };

      newDivU.appendChild(iElement);
      Box_Logos.appendChild(newDivU);

      organisationSuccess.textContent = "Image importé avec succès!";
      organisationSuccess.style.display = 'block';
      organisationError.style.display = 'none';
    };
    fileReader.readAsDataURL(file);
  } else {
    organisationError.textContent = "Le type de fichier n'est pas pris en charge. Veuillez télécharger une image JPEG, JPG ou PNG.";
    organisationError.style.display = 'block';
  }
  document.querySelector(inputClass).value = '';

}

function buttonUploaderClick(num) {
  document.querySelector('.InputH' + num).click();
}

function fileInputChange(event, num) {
  var parentId = event.target.parentNode.parentNode.id;
  var text = '';
  if (num == 2) { text = text + "-2" }
  displayFile(event.target.files[0], parentId, ".InputH" + num, text);
}




function initializeImageEditor(elm) {
  //document.body.style.overflow = 'hidden';
  if(!elm.id){
    elm.id = "SelectedIMG";
    document.getElementById("ImageEditor").style.display = 'block';
  
    // Assuming we have a div with id="editor_container"
    filerobotImageEditor = new FilerobotImageEditor(
      document.getElementById("ImageEditor"),
      {
        ...config,
        onSave: (editedImageObject, designState) => {
          // console.log('saved', editedImageObject, designState);
          // Assuming changeSRCimage is a function you want to call with the editedImageObject
          changeSRCimage(editedImageObject);
        },
        // Pass the clicked image source to the editor (modify the appropriate property based on the library's API)
        source: elm.src,
      }
    );
  
    filerobotImageEditor.render({
      onClose: (closingReason) => {
        //console.log('Closing reason', closingReason);
        filerobotImageEditor.terminate();
        document.getElementById("ImageEditor").style.display = 'none';
      },
    });
  }

}

function changeSRCimage(img) {
  var IMGTag = document.getElementById("SelectedIMG");
  IMGTag.src = img.imageBase64;
  IMGTag.removeAttribute("id");
  filerobotImageEditor.terminate();
  filerobotImageEditor = undefined;
  document.getElementById("ImageEditor").style.display = 'none';
  //document.body.style.overflow = 'auto';

}

/* </script>


<script> */


const PDrag_Area = document.querySelector('.drag-area-dim-2');
const p_input = PDrag_Area.querySelector('.p-input-uploader');
const p_icon = PDrag_Area.querySelector('.icon-uploader');

let Pfile;

const p_button = PDrag_Area.querySelector('.button-uploader-2');



PDrag_Area.addEventListener('dragover', (event) => {
  event.preventDefault();
  //console.log("dragover");
});

PDrag_Area.addEventListener('dragleave', () => {
  //console.log("dragleave");
});

PDrag_Area.addEventListener('drop', (event) => {
  event.preventDefault();
  Pfile = event.dataTransfer.files[0];
  //console.log("drop");
  displayPfile();
});
p_icon.onclick = () => {
  p_input.click();
};

p_input.addEventListener('change', function () {
  Pfile = this.files[0];
  displayPfile();
});



function displayPfile() {
  let PfileType = Pfile.type;
  let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

  if (validExtensions.includes(PfileType)) {
    let PfileReader = new FileReader();
    PfileReader.onload = () => {
      let fileURL = PfileReader.result;
      // console.log(fileURL);
      let imgTag = `<img id="CPimage" onclick="initializePImageEditor(this)" class="img-fluid" src="${fileURL}" alt="">`;
      PDrag_Area.innerHTML = imgTag;
    };
    PfileReader.readAsDataURL(Pfile);
    document.getElementById("btn-remove").classList.remove("d-none");
    //console.log( PfileReader)
  }
  p_input.value = '';
}

function deletePImage() {
  var CPimage = document.getElementById("CPimage");
  document.getElementById("btn-remove").classList.add("d-none");
  if (CPimage) {
    CPimage.parentNode.removeChild(CPimage);
    var divElement = document.createElement("div");
    divElement.className = "icon";
    divElement.appendChild(p_icon);
    PDrag_Area.appendChild(p_input);
    PDrag_Area.appendChild(divElement);
  }
}





function initializePImageEditor(elm) {
  //document.body.style.overflow = 'hidden';
  document.getElementById("PImageEditor").style.display = 'block';
  filerobotImageEditor = new FilerobotImageEditor(
    document.getElementById("PImageEditor"),
    {
      ...config,
      onSave: (editedImageObject, designState) => {
        // console.log('saved', editedImageObject, designState);
        // Assuming changeSRCimage is a function you want to call with the editedImageObject
        changeSRCPimage(editedImageObject);
      },
      source: elm.src.toString(),
    }
  );

  filerobotImageEditor.render({
    onClose: (closingReason) => {
      //console.log('Closing reason', closingReason);
      filerobotImageEditor.terminate();
      document.getElementById("PImageEditor").style.display = 'none';
    },
  });
}

function changeSRCPimage(img) {
  var IMGTag = document.getElementById("CPimage");
  IMGTag.src = img.imageBase64;
  filerobotImageEditor.terminate();
  filerobotImageEditor = undefined;
  document.getElementById("PImageEditor").style.display = 'none';
  //document.body.style.overflow = 'auto';


}
function presentatorUploader() {
  var nameInput = document.getElementById('Pname');
  var postInput = document.getElementById('Ppost');
  var nameValue = nameInput.value;
  var postValue = postInput.value;
  var datasrc = document.getElementById("CPimage").src;

  if (datasrc && nameValue) {
    var allpresentator = document.getElementById("allpresentator");
    var newPresentator = document.createElement('div');
    newPresentator.className = 'Onepresentator row border border-radius-16 p-3';
    newPresentator.innerHTML = `
<div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
<img class="img-fluid P-img-circle " src="${datasrc}" alt="P profile">
</div>
<div class="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center">
<h4 class="forum-primary-color-1">${nameValue}</h4>
<span class="forum-primary-color-2">${postValue}</span>
</div>
<div class="col-6 mx-auto border border-radius-16 p-2 d-flex justify-content-between align-items-center">
<button class="btn btn-danger" onclick="removeP(this)">Supprimer</button>
<button class="btn btn-forum-primary" onclick="updateP(this)">Modifier</button>
</div>`;
    deletePImage();
    nameInput.value = '';
    postInput.value = '';
    allpresentator.appendChild(newPresentator);
  }
}

function removeP(button) {
  var grandparentNode = button.parentNode.parentNode;
  grandparentNode.parentNode.removeChild(grandparentNode);
}


function updateP(button) {
  // Get the parent div of the clicked button
  var parentDiv = button.closest('.Onepresentator');

  // Get name and post values from the parent div
  var nameInput = parentDiv.querySelector('.forum-primary-color-1').textContent;
  var postInput = parentDiv.querySelector('.forum-primary-color-2').textContent;

  // Get image source from the parent div
  var imageSource = parentDiv.querySelector('.P-img-circle').src;

  // Update input fields with the values
  document.getElementById('Pname').value = nameInput;
  document.getElementById('Ppost').value = postInput;

  // Get the container for the image
  var PArea = document.querySelector('.drag-area-dim-2');

  // Remove any existing child elements
  PArea.innerHTML = "";

  // Create the image element
  var imgElement = document.createElement("img");

  // Set the attributes for the image element
  imgElement.id = "CPimage";
  imgElement.className = "img-fluid";
  imgElement.src = imageSource;
  imgElement.onclick = function () {
    initializePImageEditor(this);
  };
  document.getElementById("btn-remove").classList.remove("d-none");

  // Add the image element to the container
  PArea.appendChild(imgElement);

  // Call removeP function if needed
  removeP(button);
}

















/* </script>





/* <script> */
function deleteProgAction(progIndex, old_IPjour) {
  var schedule_item_list_prog = document.querySelectorAll('#tab' + old_IPjour + ' .schedule-item-list-prog');

  var array_schedule_item_list_prog = Array.from(schedule_item_list_prog);

  var removedElement = array_schedule_item_list_prog.splice(progIndex, 1)[0];

  removedElement.parentNode.removeChild(removedElement);


  var scheduleItems = document.querySelectorAll('.schedule-item');

  // Loop through each schedule item
  scheduleItems.forEach(function (item) {
    // Check if the current schedule item does not have a child with class "schedule-item-list-prog"
    if (!item.querySelector('.schedule-item-list-prog')) {
      // Remove the schedule item if the condition is true
      item.remove();
    }

  });




  $('#ScheduleItemModal').modal('hide');
  ClearModalInputs();
  Update_BTN();
}

function UpdateProgramInformation(element) {
  Update_BTN();
  ClearModalInputs();
  DaysCount();



  document.getElementById("btn-Action").innerText = "Mise à jour";
  // Get the parent .schedule-item element from the clicked item
  var scheduleItem = element.closest('.schedule-item');
  if (!scheduleItem) return; // Exit if scheduleItem is not found

  // Extract start (p-date-d) and finish (p-date-f) dates
  var IPhourd = scheduleItem.getAttribute('p-date-d');
  var IPhourf = scheduleItem.getAttribute('p-date-f');

  // Get tab id (like "tab1"), remove "tab" and save the number in IPjour
  var tabId = scheduleItem.closest('.tab_single_content').id;
  var IPjour = tabId.replace('tab', '');

  // Get presentatorInfos array
  var presentators = element.querySelectorAll('.trainer');
  var presentatorInfos = Array.from(presentators).map(trainer => {
    return {
      imgSrc: trainer.querySelector('img').getAttribute('src'),
      name: trainer.querySelector('h4').textContent,
      post: trainer.querySelector('span').textContent
    };
  });

  // Get sponsor logos from L_sponsor_src array
  var sponsorImages = element.querySelectorAll('.sponsors img');
  var L_sponsor_src = Array.from(sponsorImages).map(img => img.getAttribute('src'));

  // Get title and organization values
  var IPtitre = element.querySelector('.sc-title h3').textContent;
  var IPorg = element.querySelector('.sc-title .schedule-item-list-prog-title').textContent;

  // Get lieu from scheduleItem
  var IPlieu = element.querySelector('.place').textContent;



  var L_organisation = element.querySelectorAll('.sc-title img');
  var L_organisation_src = Array.from(L_organisation).map(img => img.getAttribute('src'));








  document.getElementById('titre').value = IPtitre;
  document.getElementById('Org').value = IPorg;
  document.getElementById('Lieu').value = IPlieu;
  document.getElementById('hourd').value = IPhourd;
  document.getElementById('hourf').value = IPhourf;
  document.getElementById('jour').value = IPjour;




  L_organisation_src.forEach(function (src) {
    var newDivU = document.createElement('div');
    newDivU.className = 'logoOrg';
    var Box_Logos = document.getElementById("organisation-Logos");
    let imgTag = `<img src="${src}" onclick="initializeImageEditor(this)" alt="Logo">`;
    newDivU.innerHTML = imgTag;

    var iElement = document.createElement("i");
    iElement.className = "fa-solid fa-xmark";
    iElement.onclick = function () {
      deleteImage(this);
    };

    newDivU.appendChild(iElement);
    Box_Logos.appendChild(newDivU);
  });

  L_sponsor_src.forEach(function (src) {
    var newDivU = document.createElement('div');
    newDivU.className = 'logoOrg';
    var Box_Logos = document.getElementById("sponsor-Logos");
    let imgTag = `<img src="${src}" onclick="initializeImageEditor(this)" alt="Logo">`;
    newDivU.innerHTML = imgTag;

    var iElement = document.createElement("i");
    iElement.className = "fa-solid fa-xmark";
    iElement.onclick = function () {
      deleteImage(this);
    };

    newDivU.appendChild(iElement);
    Box_Logos.appendChild(newDivU);
  });
  presentatorInfos.forEach(info => {

    var nameInput = document.getElementById('Pname');
    var postInput = document.getElementById('Ppost');

    var allpresentator = document.getElementById("allpresentator");
    var newPresentator = document.createElement('div');
    newPresentator.className = 'Onepresentator row border border-radius-16 p-3';

    newPresentator.innerHTML = `
<div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
<img class="img-fluid P-img-circle " src="${info.imgSrc}" alt="P profile">
</div>
<div class="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center">
<h4 class="forum-primary-color-1">${info.name}</h4>
<span class="forum-primary-color-2">${info.post}</span>
</div>
<div class="col-6 mx-auto border border-radius-16 p-2 d-flex justify-content-between align-items-center">
<button class="btn btn-danger" onclick="removeP(this)">Supprimer</button>
<button class="btn btn-forum-primary" onclick="updateP(this)">Modifier</button>
</div>`;
    allpresentator.appendChild(newPresentator);
  });

  progParent = element;
  // Get all the schedule-item-list elements
  //console.log(tabId);
  var schedule_item_list_prog = document.querySelectorAll('#' + tabId + ' .schedule-item-list-prog');

  // Find the index of the progParent in the list of schedule-item-list elements
  var progIndex = Array.from(schedule_item_list_prog).indexOf(progParent);

  // Log the number of schedule-item-list elements between progParent and other parents
  //console.log(progIndex);
  document.getElementById("btn-Action").removeAttribute("onclick");
  let stringNumber1 = IPhourd.toString();
  let stringNumber2 = IPhourf.toString();

  document.getElementById("btn-Action").setAttribute("onclick", "UpdateProg(" + progIndex + "," + IPjour + ",'" + stringNumber1 + "','" + stringNumber2 + "')");




  var Dbutton = document.createElement("button");
  Dbutton.id = "btn-delete-prog";
  Dbutton.textContent = "Supprimer";
  Dbutton.className = "btn btn-danger";
  Dbutton.type = "button";

  Dbutton.onclick = function () {
    deleteProgAction(progIndex, IPjour);
  };
  document.querySelector("#ScheduleItemModal .modal-footer").prepend(Dbutton);








}

function Update_BTN(){
  var btnAction = document.getElementById("btn-Action");

  if (btnAction) {
    btnAction.innerText = "Créer";
    btnAction.removeAttribute("onclick");
    btnAction.setAttribute("onclick", "createProg('ON')");
  };
  var btnDeleteProg = document.getElementById("btn-delete-prog");

  // Check if the button element exists before trying to remove it
  if (btnDeleteProg) {
    // Remove the button element
    btnDeleteProg.parentNode.removeChild(btnDeleteProg);
  }
  ClearModalInputs();
}

function UpdateProg(progIndex, old_IPjour, old_IPhourd, old_IPhourf) {
  // Inputs
  var IPtitre = document.getElementById('titre').value;
  var IPhourd = document.getElementById('hourd').value;
  var IPhourf = document.getElementById('hourf').value;
  var IPjour = document.getElementById('jour').value;
  var IPorg = document.getElementById('Org').value;

  var IPlieu = document.getElementById('Lieu').value;

  if (IPhourd === '' || IPhourf === '') {
    alert('Veuillez remplir tous les champs requis');
  } else if (IPhourd >= IPhourf) {
    alert("L'heure de début doit être antérieure à l'heure de fin.");
  } else {
    // Images
    var L_organisation = document.querySelectorAll('#organisation-Logos .logoOrg img');
    var L_organisation_src = Array.from(L_organisation).map(img => img.getAttribute('src'));
    //console.log(L_organisation_src);

    // Presentators
    var presentators = document.querySelectorAll('#allpresentator .Onepresentator');
    var presentatorInfos = Array.from(presentators).map(presentator => {
      return {
        imgSrc: presentator.querySelector('img').getAttribute('src'),
        name: presentator.querySelector('h4').textContent,
        post: presentator.querySelector('span').textContent
      };
    });


    var L_sponsor = document.querySelectorAll('#sponsor-Logos .logoOrg img');
    var L_sponsor_src = Array.from(L_sponsor).map(img => img.getAttribute('src'));



    if (old_IPjour.toString() != IPjour || IPhourd != old_IPhourd || IPhourf != old_IPhourf) {
      var schedule_item_list_prog = document.querySelectorAll('#tab' + old_IPjour + ' .schedule-item-list-prog');

      var array_schedule_item_list_prog = Array.from(schedule_item_list_prog);

      var removedElement = array_schedule_item_list_prog.splice(progIndex, 1)[0];

      removedElement.parentNode.removeChild(removedElement);


      var scheduleItems = document.querySelectorAll('.schedule-item');

      // Loop through each schedule item
      scheduleItems.forEach(function (item) {
        // Check if the current schedule item does not have a child with class "schedule-item-list-prog"
        if (!item.querySelector('.schedule-item-list-prog')) {
          // Remove the schedule item if the condition is true
          item.remove();
        }
      });


      createProg("ON");



    }
    else if (IPjour == old_IPjour.toString() && IPhourd == old_IPhourd && IPhourf == old_IPhourf) {
      //console.log("jasser3");
      var schedule_item_list_prog = document.querySelectorAll('#tab' + old_IPjour + ' .schedule-item-list-prog');

      var array_schedule_item_list_prog = Array.from(schedule_item_list_prog);

      var scheduleItemListProgDiv = array_schedule_item_list_prog.splice(progIndex, 1)[0];


      while (scheduleItemListProgDiv.firstChild) {
        scheduleItemListProgDiv.removeChild(scheduleItemListProgDiv.firstChild);
      }




      // Trainers container
      var trainersDiv = createAndAppendElement('div', scheduleItemListProgDiv, 'trainers');
      createAndAppendElement('p', trainersDiv, 'schedule-item-list-prog-title', 'Présenté par');

      presentatorInfos.forEach(info => {
        var DivTrainer = document.createElement("div");
        DivTrainer.className = "trainer";

        createTrainer(info.imgSrc, info.name, info.post, DivTrainer);
        trainersDiv.appendChild(DivTrainer);
      });

      // Sponsors
      var sponsorsDiv = createAndAppendElement('div', trainersDiv, 'sponsors');
      createAndAppendElement('p', sponsorsDiv, null, 'Sponsoré par');
      L_sponsor_src.forEach(sponsorSrc => {
        createAndAppendElement('img', sponsorsDiv, null, null).src = sponsorSrc;
      });
      createAndAppendElement('p', trainersDiv, 'place', IPlieu);



      // Workshop title
      var scTitleDiv = createAndAppendElement('div', scheduleItemListProgDiv, 'sc-title');
      createAndAppendElement('p', scTitleDiv, 'schedule-item-list-prog-title', IPorg);
      createAndAppendElement('h3', scTitleDiv, null, IPtitre);
      L_organisation_src.forEach(logosrc => {
        createAndAppendElement('img', scTitleDiv).src = logosrc;

      });
    }
    $('#ScheduleItemModal').modal('hide');
    if ($('#ScheduleItemModal')) {
      $('#ScheduleItemModal').modal('hide');
    }
    Update_BTN();
    orderScheduleItems();
  }


}//end UpdateProg
