import * as React from 'react';
import styles from './AllElementSpecsWebPart.module.scss';
import { IAllElementSpecsWebPartProps } from './IAllElementSpecsWebPartProps';
import {IAllElementSpecsState} from './IAllElementSpecsState'
import SharePointService from '../../../services/SharePoint/SharePointService';

import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardTitle,
  DocumentCardLocation,
  IDocumentCardPreviewProps,
} from 'office-ui-fabric-react/lib/DocumentCard';

import { Button, ButtonType, } from 'office-ui-fabric-react';

import { SearchBox, ISearchBoxStyles } from 'office-ui-fabric-react/lib/SearchBox';


export default class AllElementSpecsWebPart extends React.Component<IAllElementSpecsWebPartProps, IAllElementSpecsState> {

  constructor(props: IAllElementSpecsWebPartProps){
    super(props);

    //bind
    this.getItemsByName = this.getItemsByName.bind(this);
    this.getElemSpecs = this.getElemSpecs.bind(this);
    this.getImplementation = this.getImplementation.bind(this);
    this.getDraft = this.getDraft.bind(this);
    this.getTesting = this.getTesting.bind(this);
    this.getRelease = this.getRelease.bind(this);
    this.getUnderDevelopment = this.getUnderDevelopment.bind(this);
    this.goToItem = this.goToItem.bind(this);
    this.returnUserByID = this.returnUserByID.bind(this);
    this.getUsers = this.getUsers.bind(this);

    //set initial state:
    this.state = {
      items: [],
      users: [],
      loading: false,
      visible: false,
    };

    this.getElemSpecs();
  }


  public render(): React.ReactElement<IAllElementSpecsWebPartProps> {

    const searchBoxStyles: Partial<ISearchBoxStyles> = { root: {  marginBottom: '30px' } };

    return (
      <div >

      <div className="ms-Grid" dir="ltr">
              <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm2 ms-md4 ms-lg6 ms-xl6"> </div>
                <div className="ms-Grid-col ms-sm10 ms-md8 ms-lg6 ms-xl6">
      
                
                <SearchBox
                  styles={searchBoxStyles}
                  placeholder="Search"
                  onEscape={ev => {
                    //console.log('Custom onEscape Called');
                  }}
                  onClear={ev => {
                    //console.log('Custom onClear Called');
                  }}
                  onChange={(name) => this.getItemsByName(name)}
                  onSearch={newValue => console.log('SearchBox onSearch fired: ' + newValue)}
                />
      
      </div>
      
                </div>
                </div>
      
            <div style={{textAlign: "center"}}>
      
            
            <Button  buttonType={ ButtonType.primary }  title='All' ariaLabel='All'  onClick={this.getElemSpecs} >
              <span>All</span>
            </Button>
      
            <Button className={styles.myButtons} buttonType={ ButtonType.normal } title='Draft' ariaLabel='Draft' style={{marginLeft:"15px"}}  onClick={this.getDraft}>
              <span>Draft</span>
            </Button>
      
            <Button className={styles.myButtons} buttonType={ ButtonType.normal } title='Under development' ariaLabel='Under development' style={{marginLeft:"15px"}} onClick={this.getUnderDevelopment}>
              <span>Under development</span>
            </Button>
      
            <Button className={styles.myButtons} buttonType={ ButtonType.normal }  title='Implementation' ariaLabel='Implementation' style={{marginLeft:"15px"}} onClick={this.getImplementation}>
              <span>Implementation</span>
            </Button>

            <Button className={styles.myButtons} buttonType={ ButtonType.normal }  title='Testing' ariaLabel='Testing' style={{marginLeft:"15px"}} onClick={this.getTesting}>
              <span>Testing</span>
            </Button>

            <Button className={styles.myButtons} buttonType={ ButtonType.normal }  title='Release' ariaLabel='Release' style={{marginLeft:"15px"}} onClick={this.getRelease}>
              <span>Release</span>
            </Button>
      
      
            </div>
            
            <hr></hr>
      
              <div className="ms-Grid" dir="ltr">
              <div className="ms-Grid-row">
              
              {this.state.items.map(item => {
                //console.log(item);
                let previewPropsa: IDocumentCardPreviewProps = {
                  previewImages: [
                    {
                      previewImageSrc: 'https://edvac.sharepoint.com/sites/VIN_AVT_PCO_ElementWikiproject/SiteAssets/SitePages/VIN_AVT_PCO_ElementWikiproject/24687-AC.jpg',
                      width: 318,
                      height: 156,
                      accentColor: '#ce4b1f'
                    }
                  ],
                };
                if (item.AttachmentFiles.length > 0) {
                  //previewPropsa.previewImages[0].previewImageSrc = `https://jvspdev.sharepoint.com${item.AttachmentFiles[0].ServerRelativeUrl}`
                  previewPropsa.previewImages[0].previewImageSrc = `https://edvac.sharepoint.com${item.AttachmentFiles[0].ServerRelativeUrl}`
                   //console.log(item.AttachmentFiles[0].ServerRelativeUrl);
                }
      
                let createdOn = new Date(item.Created);
                //let formatedDate = `${createdOn.toLocaleString("default", { month: "long" })} ${createdOn.getDay()}, ${createdOn.getFullYear()} at ${createdOn.getHours()}:${createdOn.getMinutes()}:${createdOn.getSeconds()}`;
                let formatedDate = `${createdOn.toLocaleString("default", { month: "long" })} ${createdOn.getDate()}, ${createdOn.getFullYear()} at ${createdOn.toLocaleTimeString()}`;

                let hrf = `${SharePointService.context.pageContext.web.absoluteUrl}/SitePages/elemspec${item.Id}.aspx`;

                 return (
      
                  
                      
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6 ms-xl4"  style={{marginBottom:'5px'}}>
                          
                          <DocumentCard onClickHref= {hrf}>
                            <DocumentCardPreview { ...previewPropsa } 
                            />
                            <DocumentCardLocation
                              location= {item.IdeaStatus}
                              ariaLabel= {item.IdeaStatus}
                            />
                            <DocumentCardTitle title= {item.Title} />
                            <DocumentCardActivity
                              activity= {formatedDate}
                              people={
                                [
                                  { name: `${item.Author.Title}`, profileImageSrc: '' }
                                ]
                              }
                            />
                          </DocumentCard>
      
                        </div>
       
                );
              })}
                 </div>
              </div>
      
            </div>
    );
  }


  public getElemSpecs(): void {
    this.setState({loading: true});
    SharePointService.getListItems(SharePointService.elSpeclistID)
      .then(items => {
        //console.log(items);
        this.setState({
          items: items.value,
          loading: false
        });
      });
  }

  public getDraft(): void {
    this.setState({loading: true});
    SharePointService.getListItemsFIltered(SharePointService.elSpeclistID, 'DRAFT')
      .then(items => {
        //console.log(items.value);
        //console.log('vratio');
        this.setState({
          items: items.value,
          loading: false
        });
      });
  }

  public getUnderDevelopment(): void {
    this.setState({loading: true});
    SharePointService.getListItemsFIltered(SharePointService.elSpeclistID, 'UNDER DEVELOPMENT')
      .then(items => {
        this.setState({
          items: items.value,
          loading: false
        });
      });
  }

  public getImplementation(): void {
    this.setState({loading: true});
    SharePointService.getListItemsFIltered(SharePointService.elSpeclistID, 'IMPLEMENTATION')
      .then(items => {
        //console.log(items.value);
        //console.log('vratio');
        this.setState({
          items: items.value,
          loading: false
        });
      });
  }

  public getTesting(): void {
    this.setState({loading: true});
    SharePointService.getListItemsFIltered(SharePointService.elSpeclistID, 'TESTING')
      .then(items => {
        this.setState({
          items: items.value,
          loading: false
        });
      });
  }

  public getRelease(): void {
    this.setState({loading: true});
    SharePointService.getListItemsFIltered(SharePointService.elSpeclistID, 'RELEASE')
      .then(items => {
        this.setState({
          items: items.value,
          loading: false
        });
      });
  }



  public goToItem(itemID: number): void {
    //console.log(itemID);
    window.location.href = `${SharePointService.context.pageContext.web.absoluteUrl}/Lists/Idea/DispForm.aspx?ID=${itemID}`;
  }

  public returnUserByID(itemID: string): string {
    //console.log(itemID);
    //console.log('proba');
    SharePointService.getUserByID(itemID)
    .then(item => {
      return item;
    });
    return '';
      
  }

  public getUsers(): void {
    SharePointService.getUsers()
      .then(users => {
        //console.log(users.value[1]);
        this.setState({
          users: users.value,
        });
      });
  }

  public prikazialert(): void {
    alert('uspeo!');
  }

  public getItemsByName(name: string): void {
    //console.log(name);
    SharePointService.getListItems(SharePointService.elSpeclistID)
      .then(
        
        items => {
          let elspecs = items.value.filter((el) => el.Title.toUpperCase().indexOf(name.toUpperCase()) !== -1  || el.Description.toUpperCase().indexOf(name.toUpperCase()) !== -1);
          //console.log(ideas);
        //console.log('vratio');
        this.setState({
          items: elspecs,
        });
      });
  }

  
}
