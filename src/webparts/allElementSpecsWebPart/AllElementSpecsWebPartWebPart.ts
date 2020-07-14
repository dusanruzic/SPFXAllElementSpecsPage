import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';


import SharePointService from '../../services/SharePoint/SharePointService';
import {Environment } from '@microsoft/sp-core-library';

import * as strings from 'AllElementSpecsWebPartWebPartStrings';
import AllElementSpecsWebPart from './components/AllElementSpecsWebPart';
import { IAllElementSpecsWebPartProps } from './components/IAllElementSpecsWebPartProps';

export interface IAllElementSpecsWebPartWebPartProps {
  description: string;
}

export default class AllElementSpecsWebPartWebPart extends BaseClientSideWebPart<IAllElementSpecsWebPartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAllElementSpecsWebPartProps > = React.createElement(
      AllElementSpecsWebPart,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public onInit(): Promise<void> {
    return super.onInit().then(() =>{

      //let elSpeclistID = '3031e278-aab5-4dc1-aa9b-0d735b49cf29';
      let elSpeclistID = 'Element%20spec';

      //let ideaListID = 'CF70FB14-EE3E-4D16-921A-3449856770E7';
      let ideaListID = 'Idea';


      SharePointService.setup(this.context, Environment.type, elSpeclistID, ideaListID);

    });
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
