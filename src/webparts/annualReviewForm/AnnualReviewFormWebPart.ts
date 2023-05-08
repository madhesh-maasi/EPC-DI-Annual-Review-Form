import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AnnualReviewFormWebPartStrings';
import AnnualReviewForm from './components/AnnualReviewForm';
import { IAnnualReviewFormProps } from './components/IAnnualReviewFormProps';

export interface IAnnualReviewFormWebPartProps {
  description: string;
}

export default class AnnualReviewFormWebPart extends BaseClientSideWebPart<IAnnualReviewFormWebPartProps> {

  public render(): void {

    // Getting Item ID from URL Parameter - ReviewItem
    const queryParams = new URLSearchParams(window.location.search);
    const itemID = queryParams.get('ReviewItem');
    const element: React.ReactElement<IAnnualReviewFormProps> = React.createElement(
      AnnualReviewForm,
      {
        AppContext: this.context,
        ReviewItemID: itemID
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
