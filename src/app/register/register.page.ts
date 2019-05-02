import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { AlertController } from '@ionic/angular'
import { Router } from '@angular/router'
import { AngularFirestore } from '@angular/fire/firestore'
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  username: string = ""
  password: string =""
  cpassword: string = ""

  constructor(public afAuth: AngularFireAuth,
    public alert: AlertController,
    public router: Router,
    public afStore: AngularFirestore,
    public user: UserService,
    ) { }

  ngOnInit() {
  }

  async presentAlert(title: string, content: string){
    const alert = await this.alert.create({
      header: title,
      message: content,
      buttons: ['Ok']
    })
    await alert.present()
  }

  async signup(){
    const {username, password, cpassword} = this

    if(password !== cpassword){
      this.presentAlert("Error!","Passwords do not match");
      return console.error("Passwords don't match")
    }
    try{
      const res =await this.afAuth.auth.createUserWithEmailAndPassword(username + '@sakec.ac.in', password)
        this.afStore.doc(`users/${res.user.uid}`).set({
          username
        })
        this.user.setUser({
          username,
          uid:res.user.uid
        })
      console.log(res)
      this.showAlert("Success!","Welcome :" + username)
      this.router.navigate(['/tabs'])

    }
    catch(error){
      console.dir(error)
      this.showAlert("Error", error.message)
    }
  }
  async showAlert(header: string, message: string){
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["Ok"]
    })

    await alert.present()
  }
}
