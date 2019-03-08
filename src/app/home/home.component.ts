import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { StudioService } from '../shared/studio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  studioForm: FormGroup;
  slotsForm: FormGroup;
  studioDetails: any;
  searchSubmitted: boolean;
  noSchedules: boolean;
  displayError: boolean;
  showSlotForm: boolean;

  constructor(
    private studioService: StudioService
  ) { }

  ngOnInit() {
    this.studioForm = new FormGroup({
      studioName: new FormControl(''),
      localDate: new FormControl('')
    });

    this.slotsForm = new FormGroup({
      startTime: new FormControl(''),
      endTime: new FormControl(''),
      faculty:  new FormControl(''),
      assignerName:  new FormControl(''),
    });
  }

  search(form: FormGroup){
    this.displayError = false;
    this.noSchedules = false;
    this.showSlotForm = false;
    console.log('Valid?', form.valid);
    if(form.valid){
      this.studioService.getStudioData(form.value).subscribe((response: any) => {
        console.log(response);
        this.searchSubmitted = true;
        if(response){
          this.noSchedules = false;
          this.studioDetails = response;          
          const formData: any = response.studioScheduleSlotList[0];
          delete formData.studioScheduleSlotId
          this.slotsForm.setValue(formData);
        }else{
          this.noSchedules = true;
        }
      },
      error => {
        console.log('error', error);
        this.displayError = true;
      })
    }
    
  }

  displaySlot(){
    this.showSlotForm = true;
  }

  createStudio(studioForm: FormGroup, slotsForm: FormGroup, create:boolean){
    if(studioForm.valid && slotsForm.valid){
      const req = {
        "date": studioForm.value.localDate,
        "studioName": studioForm.value.studioName,
        "studioScheduleSlotList": [
          slotsForm.value
        ]
    }
    if(!create){
      this.studioService.updateStudio(req).subscribe((response:any) => {
        console.log(response);
        if(response && response.responseMsg == 'Schedule successfully updated'){
          alert(response.responseMsg)
        }else{
          alert('Could not update Schedule');
        }
      },
      error => {
        console.log('error', error);
        this.displayError = true;
      })
    }else{
      this.studioService.saveStudio(req).subscribe((response:any) => {
        console.log(response);
        if(response && response.responseMsg == 'Schedule successfully created'){
          alert(response.responseMsg)
        }else{
          alert('Could not create Schedule');
        }
      },
      error => {
        console.log('error', error);
        this.displayError = true;
      })
    }
      
    }
  }

  reset(){
    this.studioForm.reset();
    this.slotsForm.reset();
    this.studioDetails = '';
    this.showSlotForm = false;
    this.displayError = false;
  }
}
