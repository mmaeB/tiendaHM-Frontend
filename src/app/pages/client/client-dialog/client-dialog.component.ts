import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Client } from '../../../model/client';
import { ClientService } from '../../../services/client.service';
import { switchMap } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  templateUrl: './client-dialog.component.html',
  styleUrl: './client-dialog.component.css',
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ClientDialogComponent {
  client: Client;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Client,
    private _dialogRef: MatDialogRef<ClientDialogComponent>,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.client = { ...this.data };
  }

  close() {
    this._dialogRef.close();
  }

  operate() {
    if (this.client && this.client.idClient > 0) {
      // UPDATE
      this.clientService.update(this.client.idClient, this.client)
        .pipe(switchMap(() => this.clientService.findAll()))
        .subscribe(data => {
          this.clientService.setCategoryChange(data);
          this.clientService.setMessageChange('Cliente actualizado correctamente');
        });
    } else {
      // INSERT
      this.clientService.save(this.client)
        .pipe(switchMap(() => this.clientService.findAll()))
        .subscribe(data => {
          this.clientService.setCategoryChange(data);
          this.clientService.setMessageChange('Cliente creado correctamente');
        });
    }

    this.close();
  }
}
