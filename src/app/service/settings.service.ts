import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  settingsForm = {
    listView: false,
    showTitles: false
  }

  constructor() {
    this.settingsForm.listView = localStorage.getItem('listView') == "true"
    this.settingsForm.showTitles = localStorage.getItem('showTitles') == "true"
  }

  toggleListView = () => {
    this.settingsForm.listView = !this.settingsForm.listView
    localStorage.setItem('listView',  this.settingsForm.listView.toString())
  }

  toggleShowTitles = () => {
    this.settingsForm.showTitles = !this.settingsForm.showTitles
    localStorage.setItem('showTitles',  this.settingsForm.showTitles.toString())
  }

}
