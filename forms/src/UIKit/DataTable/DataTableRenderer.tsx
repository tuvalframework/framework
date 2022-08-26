import { foreach, StringBuilder } from '@tuval/core';

import { ControlHtmlRenderer } from '../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer';
import { Teact } from '../../windows/Forms/Components/Teact';
import { DomHandler } from '../../windows/Forms/Components/DomHandler';
import { DataTableClass } from './DataTableClass';
import { Column } from '../Components/column/Column';
import { DataTable } from '../Components/datatable/DataTable';
import { getView } from '../getView';

//console.log('AA_BB');
DomHandler.addCssToDocument(require('../Components/dropdown/Thema.css'));

export class DataTableRenderer extends ControlHtmlRenderer<DataTableClass> {
    shadowDom: any;
    protected menu: any;
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: DataTableClass, sb: StringBuilder): void {
        sb.AppendLine(require('../Components/datatable/DataTable.css'));
        sb.AppendLine(require('../Components/datatable/Thema.css'));
    }

    public GenerateElement(obj: DataTableClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public GenerateBody(obj: DataTableClass): void {
        const products = [
            { "id": "1000", "code": "f230fh0g3", "name": "Bamboo Watch", "description": "Product Description", "image": "bamboo-watch.jpg", "price": 65, "category": "Accessories", "quantity": 24, "inventoryStatus": "INSTOCK", "rating": 5 },
            { "id": "1001", "code": "nvklal433", "name": "Black Watch", "description": "Product Description", "image": "black-watch.jpg", "price": 72, "category": "Accessories", "quantity": 61, "inventoryStatus": "INSTOCK", "rating": 4 },
            { "id": "1002", "code": "zz21cz3c1", "name": "Blue Band", "description": "Product Description", "image": "blue-band.jpg", "price": 79, "category": "Fitness", "quantity": 2, "inventoryStatus": "LOWSTOCK", "rating": 3 },
            { "id": "1003", "code": "244wgerg2", "name": "Blue T-Shirt", "description": "Product Description", "image": "blue-t-shirt.jpg", "price": 29, "category": "Clothing", "quantity": 25, "inventoryStatus": "INSTOCK", "rating": 5 },
            { "id": "1004", "code": "h456wer53", "name": "Bracelet", "description": "Product Description", "image": "bracelet.jpg", "price": 15, "category": "Accessories", "quantity": 73, "inventoryStatus": "INSTOCK", "rating": 4 },
            { "id": "1005", "code": "av2231fwg", "name": "Brown Purse", "description": "Product Description", "image": "brown-purse.jpg", "price": 120, "category": "Accessories", "quantity": 0, "inventoryStatus": "OUTOFSTOCK", "rating": 4 },
            { "id": "1006", "code": "bib36pfvm", "name": "Chakra Bracelet", "description": "Product Description", "image": "chakra-bracelet.jpg", "price": 32, "category": "Accessories", "quantity": 5, "inventoryStatus": "LOWSTOCK", "rating": 3 },
            { "id": "1007", "code": "mbvjkgip5", "name": "Galaxy Earrings", "description": "Product Description", "image": "galaxy-earrings.jpg", "price": 34, "category": "Accessories", "quantity": 23, "inventoryStatus": "INSTOCK", "rating": 5 },
            { "id": "1008", "code": "vbb124btr", "name": "Game Controller", "description": "Product Description", "image": "game-controller.jpg", "price": 99, "category": "Electronics", "quantity": 2, "inventoryStatus": "LOWSTOCK", "rating": 4 },
            { "id": "1009", "code": "cm230f032", "name": "Gaming Set", "description": "Product Description", "image": "gaming-set.jpg", "price": 299, "category": "Electronics", "quantity": 63, "inventoryStatus": "INSTOCK", "rating": 3 }
        ]
        this.WriteComponent(
            <DataTable value={obj._value}>
                {/*   <Column field="code" header="Code"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="category" header="Category"></Column>
                <Column field="quantity" header="Quantity"></Column> */}
                {this.getColumns(obj)}
            </DataTable>
        );
    }

    private getColumns(obj: DataTableClass): any[] {
        const result = [];


        for (let i = 0; i < obj._columns.length; i++) {
            const bodyTemplate = obj._columns[i]._body;
            const view = getView(obj.controller, bodyTemplate);
            let template;
            if (view != null) {
                template = view.Render();
            }

            result.push(
                <Column field={obj._columns[i]._field} header={template} headerStyle={{ padding: '0px' }} style={{ boxSizing: 'border-box', minWidth: obj._columns[i]._width, maxWidth: obj._columns[i]._width }}></Column>
            )
        }

        return result;
    }
}