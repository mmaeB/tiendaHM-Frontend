import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { switchMap } from 'rxjs';
import { Client } from '../../model/client';
import { ClientService } from '../../services/client.service';
import { ClientDialogComponent } from './client-dialog/client-dialog.component';

@Component({
  selector: 'app-client',
  standalone: true,
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInput,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    RouterOutlet,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class ClientComponent {
  dataSource: MatTableDataSource<Client>;

  columnsDefinitions = [
    { def: 'idClient', label: 'ID', hide: true },
    { def: 'nombre', label: 'Nombre', hide: false },
    { def: 'apellido', label: 'Apellido', hide: false },
    { def: 'dni', label: 'DNI', hide: false },
    { def: 'email', label: 'Email', hide: false },
    { def: 'telefono', label: 'Teléfono', hide: false },
    { def: 'ciudad', label: 'Ciudad', hide: false },
    { def: 'fechaInscripcion', label: 'Fecha de Inscripción', hide: false },
    { def: 'actions', label: 'Acciones', hide: false }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private clientService: ClientService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.clientService.findAll().subscribe(data => this.createTable(data));
    this.clientService.getCategoryChange().subscribe(data => this.createTable(data));
    this.clientService.getMessageChange().subscribe(msg =>
      this._snackBar.open(msg, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      })
    );
  }

  createTable(data: Client[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    return this.columnsDefinitions.filter(c => !c.hide).map(c => c.def);
  }

  delete(id: number): void {
    this.clientService.delete(id)
      .pipe(switchMap(() => this.clientService.findAll()))
      .subscribe(data => {
        this.clientService.setCategoryChange(data);
        this.clientService.setMessageChange('Cliente eliminado correctamente');
      });
  }

  openDialog(client?: Client): void {
    this._dialog.open(ClientDialogComponent, {
      width: '650px',
      data: client,
      autoFocus: true
    });
  }

formatFecha(fecha: string): string {
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

}
