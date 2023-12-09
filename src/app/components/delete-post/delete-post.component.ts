import { Component } from '@angular/core';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-post',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './delete-post.component.html',
  styleUrl: './delete-post.component.css',
})
export class DeletePostComponent {
  constructor(
    public dialogRef: MatDialogRef<DeletePostComponent>
  ) {}

  handleDelete(): void {
    this.dialogRef.close('OK');
  }
}
