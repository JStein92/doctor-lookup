import { DoctorSearch } from './../js/doctor-search.js';

$(function(){

  $('#doctorSearch').submit(function(event) {
    event.preventDefault();

    const location = $('#location').val();
    $('#location').val("");
    const issue = $('#issue').val();
    $('#issue').val("");
    const name = $('#name').val();
    $('#name').val("");

    const doctorSearch = new DoctorSearch();
    doctorSearch.search(location,issue,name);

  });

});
