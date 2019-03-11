import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { StudioService } from '../shared/studio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChildren('inputField') inputField: any;
  @ViewChildren('startTimeField') startTimeField: any;
  @ViewChildren('endTimeField') endTimeField: any;
  
  studioForm: FormGroup;
  slot = {
    startTime: '',
    endTime: '',
    faculty:  '',
    assignerName:  ''
  };
  slotsList = [];
  studioNotExists: boolean;
  existingStudio: boolean;
  formSubmitted: boolean;
  successMsg: string = '';
  errorMsg: string = '';
  scheduleId: string = '';
  datePattern = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
  timePattern = /^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/;

  constructor(
    private studioService: StudioService
  ) { }

  ngOnInit() {
    this.studioForm = new FormGroup({
      studioName: new FormControl(''),
      localDate: new FormControl('')
    });
  }

  // add a time slot
  addSlot(){
    this.slotsList.push(JSON.parse(JSON.stringify(this.slot)));
    this.studioNotExists = false;
    console.log('this.slotsList', this.slotsList)
  }

  // remove a time slot
  removeSlot(index){
    this.slotsList.splice(index,1);
  }

  // save or update schedule
  save(update:boolean){
    console.log(this.inputField.toArray());
    this.formSubmitted = true;
    let valid = true;
    this.inputField.toArray().forEach(item => {
      if(!item.valid){
        valid = false;
        return
      }
    });
    this.startTimeField.toArray().forEach(item => {
      if(!item.valid){
        valid = false;
        return
      }
    });
    this.endTimeField.toArray().forEach(item => {
      if(!item.valid){
        valid = false;
        return
      }
    });

    // proceed with calling apis if both forms are valid
    if(valid && this.studioForm.valid){
      this.formSubmitted = false;
      let req = {
        date: this.studioForm.value.localDate,
        studioName: this.studioForm.value.studioName,
        scheduleId: this.scheduleId,
        studioScheduleSlotList: this.slotsList
      }
      if (update) {
        //update
        req['studioScheduleId'] = this.scheduleId;
        console.log('update request', req);
        this.studioService.updateStudio(req).subscribe((response:any) => {
          console.log(response);
          if(response && response.responseMsg == 'Schedule successfully updated'){
            this.successMsg = response.responseMsg;
          }else{
            this.errorMsg = 'Could not update Schedule. Try again.';
          }
          this.clearMessages();
        },
        error => {
          this.errorMsg = 'An error occured. Try again.';
          this.clearMessages();
        })
      } else {
        //save
        this.studioService.saveStudio(req).subscribe((response:any) => {
          console.log(response);
          if(response && response.responseMsg == 'Schedule successfully created'){
            this.successMsg = response.responseMsg;
          }else{
            this.errorMsg = 'Could not update Schedule. Try again.';
          }
          this.clearMessages();
        },
        error => {
          this.errorMsg = 'An error occured. Try again.';
          this.clearMessages();
        })
      }
    }
  }

  // serach studio with studio name and date
  search(form: FormGroup){
    console.log('Valid?', form.valid);
    this.formSubmitted = true;    
    if(form.valid){
      this.formSubmitted = false;
      this.studioService.getStudioData(form.value).subscribe((response: any) => {
        console.log(response);
        if(response){
          this.studioNotExists = false;
          this.existingStudio = true;
          this.scheduleId = response.studioScheduleId;
          if(response.studioScheduleSlotList && response.studioScheduleSlotList.length){
            this.slotsList = response.studioScheduleSlotList;
          }         
        }else{
          this.studioNotExists = true;
          this.existingStudio = false;
        }
      },
      error => {
        this.errorMsg = 'An error occured. Try again.';
        this.clearMessages();
      })
    }    
  }

  // clear messages and reset form
  clearMessages(){  
    this.slotsList = [];
    this.studioForm.reset();
    this.studioNotExists = false;
    this.existingStudio = false;
    this.formSubmitted = false;
    this.scheduleId = ''; 
    setTimeout(() => {      
      this.successMsg = '';
      this.errorMsg = '';      
    }, 5000);
  }

  // reset studio form
  reset(){
    this.studioForm.reset();
  }

// end of component
}
