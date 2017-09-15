import { DoctorSearch } from './../js/doctor-search.js';

$(function(){
  const doctorSearch = new DoctorSearch();
  doctorSearch.specialtiesPromise();

  $('#doctorSearch').submit(function(event) {
    event.preventDefault();

    const location = $('#location').val();
    $('#location').val("");
    const issue = $('#issue').val();
    $('#issue').val("");
    const name = $('#name').val();
    $('#name').val("");

    const specialties = $('#specialtiesOutput').val();
    console.log(specialties.join('%2C'));

    doctorSearch.search(location,issue,name);

  });
});
