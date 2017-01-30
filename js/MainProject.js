+
$(document).ready(function(){

    var ModelProject = new TProjectModel();
    var ViewProject = new TProjectView();
    var ControllerProject = new TProjectController();
    var ModelPopUp = new TPopUpModel();
    var ViewPopUp = new TPopUpView();
    ControllerProject.init(ModelProject, ViewProject, ModelPopUp, ViewPopUp);
});

