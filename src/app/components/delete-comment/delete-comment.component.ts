import { Component } from '@angular/core';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-comment',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './delete-comment.component.html',
  styleUrl: './delete-comment.component.css',
})
export class DeleteCommentComponent {
  constructor(public dialogRef: MatDialogRef<DeleteCommentComponent>) {}

  handleDelete(): void {
    this.dialogRef.close('OK');
  }
}
