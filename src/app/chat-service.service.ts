import { Injectable } from '@angular/core';

import { Chat } from './model/chat';
import {  AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  
  private chatData: AngularFirestoreCollection<Chat>;
  activeChatInfo = {
    isActive: false,
    bookingId: null
  }
 

  constructor(private afs: AngularFirestore) {
   }

  addUser(bookingId, userModel) {
    return this.afs.collection(userModel.type).doc(bookingId).set({
      userModel
  })
 }

  updateIsTyping(bookingId,userModel,type){
    return this.afs.collection(type).doc(bookingId).update({
      userModel
  });
  }

  addChats(chat: Chat,bookingId) {
     //Database Instance of firestore
    this.chatData = this.afs.collection<Chat>(bookingId);
    return this.chatData.add(chat);
  }

  getChats(bookingId,userId){
    // Database Instance of firestore
    this.chatData = this.afs.collection<Chat>(bookingId);
    return this.afs.collection( bookingId , ref => ref.orderBy('dateTime','asc')).valueChanges()
  }
}