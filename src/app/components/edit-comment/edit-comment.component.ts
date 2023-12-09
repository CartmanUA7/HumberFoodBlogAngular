import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-comment',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './edit-comment.component.html',
  styleUrl: './edit-comment.component.css',
})
export class EditCommentComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditCommentComponent>
  ) {}

  contentValue = '';

  ngOnInit(): void {
    this.contentValue = this.data.content;
  }

  handleEdit(): void {
    this.dialogRef.close(this.contentValue);
  }
}
