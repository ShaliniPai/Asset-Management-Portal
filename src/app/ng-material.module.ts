import { NgModule } from '@angular/core';
import {
  MatToolbarModule, MatTabsModule, MatDividerModule, MatIconModule,
  MatButtonModule, MatMenuModule, MatSidenavModule, MatListModule, MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS, MatTableModule,
  MatGridListModule, MatSelectModule, MatSnackBarModule, MatCheckboxModule, MatPaginatorModule, MatInputModule, MatDialogModule,
  MatTooltipModule, MatNativeDateModule, MatFormFieldModule, MatDatepickerModule
} from '@angular/material';


@NgModule({
  declarations: [],
  imports: [
    MatToolbarModule, MatTabsModule, MatDividerModule, MatIconModule,
    MatButtonModule, MatMenuModule, MatSidenavModule, MatListModule, MatRadioModule, MatGridListModule, MatSelectModule, MatSnackBarModule,
    MatTableModule, MatCheckboxModule, MatPaginatorModule, MatInputModule, MatDialogModule,
    MatTooltipModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule
  ],
  providers: [{ provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } }],
  exports: [
    MatToolbarModule, MatTabsModule, MatDividerModule, MatIconModule,
    MatButtonModule, MatMenuModule, MatSidenavModule, MatListModule, MatRadioModule, MatGridListModule, MatSelectModule, MatSnackBarModule,
    MatTableModule, MatCheckboxModule, MatPaginatorModule, MatInputModule, MatDialogModule, MatTooltipModule, MatDatepickerModule,
    MatNativeDateModule, MatFormFieldModule
  ]
})
export class NgMaterialModule { }
