ClickUp CRM integration with TD Website forms

Table of Content
Step #1 → TD Website Forms Analysis
Step #2 → ClickUp CRM Architecture & Configuration
Structure and Architecture:
Fields mapping & Configuration:
Parents Entities
Custom Fields:
Step #3 → API Payload
Authorization Token for API usage:
Global Authentication & Endpoint
CUSTOM FIELDS in API PAYLOAD
Step #4 → Some Logic Rules
Step #5 → Samples (Forms Submissions & their API Payload)


Step #1 → TD Website Forms Analysis
Colors meaning
Shared fields between all 3 forms:
Name
Email
Phone number
Message Description

Shared fields between 2 forms (Contact us and QUote)
Company Name

Specific fields to each form:

Form #1
Contact Us form
Form #2
Price Quote form
Form #3
Job Application form
Name
Email
Phone number
Company Name
Inquire Type
Subject
Message
Service Type
Contact information
Full name
Company name
Email
Phone Number
Shipping Details
Origin City
Destination City
Expected shipment volume
Additional details
Full name
Email
Phone Number
Desired Position
Additional message






Step #2 → ClickUp CRM Architecture & Configuration

Structure and Architecture:



Dedicated SPACE for CRM & Support Inquires

TD team can have other spaces where they are managing other things such as (marketing, sales, operations tasks, etc)

Folder dedicated for WEBSITE support

Since TD team can receive Support inquires from other channels (WhatsApp, Calls, Emails)

Listing dedicated for EACH form to isolate the form submissions/responses in a more manageable way

Since each form might be handled by a different TD team , for example 
Career forms will be handled by HR team, 
Contact Us forms can be handled by Support Team, 
Quotation forms can be handled by Sales Team



Fields mapping & Configuration:
Parents Entities
#
Type
Name
ID
Link
1
Space
Support Inquires
90189202457
https://app.clickup.com/90182301865/v/s/90189202457 
2
Folder
Website forms Submission
901811386731
https://app.clickup.com/90182301865/v/f/901811386731/90189202457 
3
Listing
Website - CONTACT US form
901815001088 
https://app.clickup.com/90182301865/v/li/901815001088 
4
Listing
Website - PRICE QUOTATION form
901815001090 
https://app.clickup.com/90182301865/v/li/901815001090 
5
Listing
Website - JOB APPLICATION form
901815001094 
https://app.clickup.com/90182301865/v/li/901815001094 


Custom Fields:
TD website fields 
FORM 1
CONTACT US

class="page_form__arM1T"
TD website fields 
FORM 2
REQUEST QUOTE

class="page_form__Nl1nI"
TD website fields 
FORM 3
CAREERS

class="page_form__WRZJu"
ClickUp fields
Field ID
Field Level
Field Actual Location
name="name"
name="name"
name="name"
id="name"
Lead (Name)
da6cd06a-ce8b-4bd6-bbac-aa461b05cf7c
Shared fields (Parent FOLDER level)
FOLDER (Website forms Submission)
name="phone"
name="phone"
name="phone"
id="phone"
Lead (Phone Number)
a1f7afc6-6fb6-4004-b455-e206b9b50d23
Shared fields (Parent FOLDER level)
FOLDER (Website forms Submission)
name="email"
name="email"
name="email"
id="email"
Lead (Email)
c841be09-4096-4840-9809-3ee2f0ba3059
Shared fields (Parent FOLDER level)
FOLDER (Website forms Submission)
name="company"
name="company"
NOT for this form
Lead (Company Name)
1c56ae02-b0f8-4557-be5c-6e872198eaac
Shared fields (Parent FOLDER level)
FOLDER (Website forms Submission)
name="message"
name="additionalDetails"
name="message"
id="message"
Lead (Message Details)
b3b7adb2-63c5-4209-92bb-c6d84e17d2ea
Shared fields (Parent FOLDER level)
FOLDER (Website forms Submission)
name="type"
NOT for this form
NOT for this form
Inquire Subject (Title)
1b8ac140-791c-43c2-81e2-55452d433f72
Specific Fields (LISTING level)
LISTING (Website - CONTACT US form)
name="subject"
NOT for this form
NOT for this form
Inquire Type
5f928592-08d3-411c-8368-32964b5e0e79
Specific Fields (LISTING level)
LISTING (Website - CONTACT US form)
NOT for this form
type="button"
class="page_serviceOption__8VPVa "
NOT for this form
Service Type
b127a680-447e-47d2-b0bc-5484b436c8d4
Specific Fields (LISTING level)
LISTING (Website - REQUEST QUOTE form)
NOT for this form
name="originCity"
NOT for this form
Origin City (Shipping Details)
da83b54f-eaf8-456b-bdfa-3876b397dab4
Specific Fields (LISTING level)
LISTING (Website - REQUEST QUOTE form)
NOT for this form
name="destinationCity"
NOT for this form
Destination City (Shipping Details)
85e24e56-5fa8-48f4-a7e0-a3630e82e466
Specific Fields (LISTING level)
LISTING (Website - REQUEST QUOTE form)
NOT for this form
name="estimatedVolume"
NOT for this form
Expected Shipment Volume (Shipping Details)
6ad021d1-3926-421e-ac0f-6c6ab10f262b
Specific Fields (LISTING level)
LISTING (Website - REQUEST QUOTE form)
NOT for this form
NOT for this form
name="position"
id="position"
Desired Position (Careers)
9bcedea3-e179-490c-84a3-13b8944f805c
Specific Fields (LISTING level)
LISTING (Website - CAREERS form)

Step #3 → API Payload
Authorization Token for API usage:
Authorization: pk_95603081_E1ZLSANJP4NEVS10OWD40K34MAPNM7IJ 



ClickUp API documentation https://developer.clickup.com/reference/createtask 

Global Authentication & Endpoint
Base URL: https://api.clickup.com/api/v2/list/{list_id}/task
Method: POST
Headers:
Authorization: [Your_API_Token]
Content-Type: application/json


CUSTOM FIELDS in API PAYLOAD



{
  "name": "SUPPORT CONTACT US - Khalid Majed",
  "description": "Customer left a message: I have been waiting for the parcel for days so far, but no update on the live tracking, I messaged you on whatsApp but no resposne, can you please update me on this issue ASAP !!!",
  "status": "Open",
  "priority": 1,
  "tags": [
    "website-form-support",
    "general-inquire"
  ],
  "custom_fields": [
    {
	## Lead (Name)
      "id": "da6cd06a-ce8b-4bd6-bbac-aa461b05cf7c",
      "value": "Khalid Majed"
    },
    {
	## Lead (Phone Number)
      "id": "a1f7afc6-6fb6-4004-b455-e206b9b50d23",
      "value": "0565412345"
    },
    {
	## Lead (Email)
      "id": "c841be09-4096-4840-9809-3ee2f0ba3059",
      "value": "khalidmajid221@gmail.com"
    },
    {
	## Lead (Company Name)
      "id": "1c56ae02-b0f8-4557-be5c-6e872198eaac",
      "value": "Hala Perfumes Store"
    },
    {
	## Lead (Message Details)
      "id": "b3b7adb2-63c5-4209-92bb-c6d84e17d2ea",
      "value": "I have been waiting for the parcel for days so far, but no update on the live tracking, I messaged you on whatsApp but no resposne, can you please update me on this issue ASAP !!!"
    },
    {
	## Inquire Subject (Title)
      "id": "1b8ac140-791c-43c2-81e2-55452d433f72",
      "value": "Parcel shipment issue"
    },
    {
	## Inquire Type
      "id": "5f928592-08d3-411c-8368-32964b5e0e79",
      "value": "General Inquiry"
    }
  ]
}






Step #4 → Some Logic Rules

When the lead is submitting a form, then a Task is created in the ClickUp CRM space

The ClickUp CRM is just a normal Clickup SPACE

Since a (Website form submission) is a (Task on ClickUp CRM) so we have to consider the following rules

Task Name
Task Description
Task Status
Task Priority
Task Tags
Custom fields 


Website TD Contact Us form
ClickUp Task Details




#
ClickUp Field
ClickUp field ID
Sample Value
Logic behind its Value
Code configuration
Notes
1
Task Title/Name


name
string
required


"SUPPORT CONTACT US - Khalid Majed"
The task name is a combination (concatenation) of multiple texts

 "name": "SUPPORT CONTACT US - Khalid Majed"

form_name = SUPPORT CONTACT US

lead_name = Khalid Majed
Code setup

"Name" = CONCAT({form_name} + {-} {lead_name})

Sample

"Name" = CONCAT(SUPPORT CONTACT US - Khalid Majed)


Form Name is the Source of this CRM record, from which form of the (3 websites) forms this CRM ticket is generated

We can label them as CONST

Form #1 - Contact Us Support
{form_name} = SUPPORT CONTACT US

Form #2 - Price Quotation
{form_name} = PRICE QUOTE

Form #3 - Careers
{form_name} = CAREERS JOB APPLICATION
2
Task Description


description
string


"Customer left a message: I have been waiting for the parcel for days so far, but no update on the live tracking, I messaged you on whatsApp but no resposne, can you please update me on this issue ASAP !!!"
The Task Description should be a concatenation of 2 strings

"description": "Customer left a message: I have been waiting for the parcel for days so far, but no update on the live tracking, I messaged you on whatsApp but no resposne, can you please update me on this issue ASAP !!!"

{Customer left a message: } + {I have been waiting for the parcel for...}

{message_details} is coming from the (form TEXT AREA field) where the lead has written the full message submitted in the form
"description" = CONCAT(Customer left a message:  {message})



3
Task Status
status
string
"Open"
Assign the Status to always to OPEN
Status" = "Open"
All forms submitted are OPENED tickets by default when added to the CRM

We are NOT involved in the process of the Ticket Handling, our task is ONLY to add a NEW record and our mission is done by this step only.
4
Task Priority
priority
integer | null
1
Assign the Priority to always to 1 indicating it is urgent
"priority": 1
Since each form Type is being handled in its dedicated ClickUp Listing, wich means all forms submissions are being handled independently and NOT grouped all together

This means, in each listing, the Task will always be priority 1 URGNET
5
Task Tags
tags
array of strings
  [
    "website-support",
    "general inquire"
  ]
Tags will be assigned based on certain CONST allocated for each form
Main tags for the MAIN 3 forms:

Form #1 - Contact Us Support
{form_name} = SUPPORT CONTACT US

Form #2 - Price Quotation
{form_name} = PRICE QUOTE

Form #3 - Careers
{form_name} = CAREERS JOB APPLICATION

If Contact Us form, THEN Tags will be


Main tags for the MAIN 3 forms:

Form #1 - Contact Us Support
"website-support"

Form #2 - Price Quotation
"website-quote"

Form #3 - Careers
"website-careers"

Now, regarding EXTRA SPECIFIC tags for each form

If Contact Us form, THEN Tags will be:
They will be retrieved from the field (Inquiry Type)
#1 (General Inquiry) = "general-inquiry"
#2 (Sales) = "sales"
#3 (Technical Support) = "technical-support"
#4 (Partnership) = "partnership"

If QUOTE form, THE Tags will be:
They will be retrieved from
Service Type
Shipping volume
Origin City (FROM)
Destination City (TO)

Service Type
"express-delivery"
"storage-warehousing"
"fulfillment-service"
"returns-management"

Shipping volume
"1-50-orders-month"
"51-200-orders-month"
"201-500-orders-month"
"501-1000-orders-month"
"above-1000-orders-month"

Origin City (FROM)
Use a pre-fix FROM to indicate (Origin City)
"FROM-Riyadh"
"FROM-Jeddah"
"FROM-Qaseen"

Destination City (TO)
Use a pre-fix TO to indicate (Destination City)
"TO-Riyadh"
"TO-Jeddah"
"TO-Qaseen"

If CAREERS form, THE Tags will be:
They will be retrieved from the field (Desired Position)
#1 (Delivery Driver) = "delivery-driver"
#2 (Customer Service) = "customer-service"
#3 (Warehouse Operations) = "warehouse-operations"
#4 (Operations) = "operations"
#5 (Sales) = "sales"
#6 (IT) = "it-technology team"
#7 (Other) = "other"
6
Custom fields 
custom_fields
array


You can include one or more Custom Fields to set them when creating a new task.

This is discussed in details in this section

https://docs.google.com/document/d/13RXUWhwCP5z5QNU5RCIfRJC5brroi61HPTd0rfSfYGY/edit?tab=t.mtzkzmfubem6#heading=h.39s23n8t37uv 

https://docs.google.com/document/d/13RXUWhwCP5z5QNU5RCIfRJC5brroi61HPTd0rfSfYGY/edit?tab=t.mtzkzmfubem6#heading=h.5ay7mtu4m89a 


Step #5 → Samples (Forms Submissions & their API Payload)

TD website fields 
FORM 1
CONTACT US

class="page_form__arM1T"
TD website fields 
FORM 2
REQUEST QUOTE

class="page_form__Nl1nI"
TD website fields 
FORM 3
CAREERS

class="page_form__WRZJu"




{
  "name": "SUPPORT CONTACT US - Khalid Majed",
  "description": "Customer left a message: I have been waiting for the parcel for days so far, but no update on the live tracking, I messaged you on whatsApp but no resposne, can you please update me on this issue ASAP !!!",
  "status": "Open",
  "priority": 1,
  "tags": [
    "website-support",
    "general inquire"
  ],
  "custom_fields": [
    {
	## Lead (Name)
      "id": "da6cd06a-ce8b-4bd6-bbac-aa461b05cf7c",
      "value": "Khalid Majed"
    },
    {
	## Lead (Phone Number)
      "id": "a1f7afc6-6fb6-4004-b455-e206b9b50d23",
      "value": "0565412345"
    },
    {
	## Lead (Email)
      "id": "c841be09-4096-4840-9809-3ee2f0ba3059",
      "value": "khalidmajid221@gmail.com"
    },
    {
	## Lead (Company Name)
      "id": "1c56ae02-b0f8-4557-be5c-6e872198eaac",
      "value": "Hala Perfumes Store"
    },
    {
	## Lead (Message Details)
      "id": "b3b7adb2-63c5-4209-92bb-c6d84e17d2ea",
      "value": "I have been waiting for the parcel for days so far, but no update on the live tracking, I messaged you on whatsApp but no resposne, can you please update me on this issue ASAP !!!"
    },
    {
	## Inquire Subject (Title)
      "id": "1b8ac140-791c-43c2-81e2-55452d433f72",
      "value": "Parcel shipment issue"
    },
    {
	## Inquire Type
      "id": "5f928592-08d3-411c-8368-32964b5e0e79",
      "value": "General Inquiry"
    }
  ]
}




{
  "name": "PRICE QUOTE - Khalid Majed",
  "description": "Customer left a message: I am interested to know the pricing for your Express delivery from Riyadh to Jeddah, I am a Perfume store and I got many clients in Jeddah, my current Logistic Supplier in Jeddah is not doing well and I would like to change them.",
  "status": "Open",
  "priority": 1,
  "tags": [
    "website-quote",
    "express-delivery",
    "201-500-orders-month",
    "FROM-Riyadh",
    "TO-Riyadh"
  ],
  "custom_fields": [
    {
	## Lead (Name)
      "id": "da6cd06a-ce8b-4bd6-bbac-aa461b05cf7c",
      "value": "Khalid Majed"
    },
    {
	## Lead (Phone Number)
      "id": "a1f7afc6-6fb6-4004-b455-e206b9b50d23",
      "value": "0565412345"
    },
    {
	## Lead (Email)
      "id": "c841be09-4096-4840-9809-3ee2f0ba3059",
      "value": "khalidmajid221@gmail.com"
    },
    {
	## Lead (Company Name)
      "id": "1c56ae02-b0f8-4557-be5c-6e872198eaac",
      "value": "Hala Perfumes Store"
    },
    {
	## Lead (Message Details)
      "id": "b3b7adb2-63c5-4209-92bb-c6d84e17d2ea",
      "value": "I am interested to know the pricing for your Express delivery from Riyadh to Jeddah, I am a Perfume store and I got many clients in Jeddah, my current Logistic Supplier in Jeddah is not doing well and I would like to change them."
    },
    {
	## Service Type
      "id": "b127a680-447e-47d2-b0bc-5484b436c8d4",
      "value": "Express Delivery"
    },
    {
	## Origin City - Shipping Details
      "id": "da83b54f-eaf8-456b-bdfa-3876b397dab4",
      "value": "Riyadh"
    },
    {
	## Destination City - Shipping Details
      "id": "85e24e56-5fa8-48f4-a7e0-a3630e82e466",
      "value": "Jeddah"
    },
    {
	## Expected Shipping Volume - Shipping Details
      "id": "6ad021d1-3926-421e-ac0f-6c6ab10f262b",
      "value": "201-500 shipments/month"
    }
  ]
}




{
  "name": "SUPPORT CONTACT US - Khalid Majed",
  "description": "Customer left a message: I would like to apply for this job position, I have 5 years experience and working with 7 companies before, I am known for my adaptability, efficiency, and problem-driven approach in handling customer issues with high success rate and satisfaction.",
  "status": "Open",
  "priority": 1,
  "tags": [
    "website-careers",
    "customer-service"
  ],
  "custom_fields": [
    {
	## Lead (Name)
      "id": "da6cd06a-ce8b-4bd6-bbac-aa461b05cf7c",
      "value": "Khalid Majed"
    },
    {
	## Lead (Phone Number)
      "id": "a1f7afc6-6fb6-4004-b455-e206b9b50d23",
      "value": "0565412345"
    },
    {
	## Lead (Email)
      "id": "c841be09-4096-4840-9809-3ee2f0ba3059",
      "value": "khalidmajid221@gmail.com"
    },
    {
	## Lead (Company Name)
      "id": "1c56ae02-b0f8-4557-be5c-6e872198eaac",
      "value": "Hala Perfumes Store"
    },
    {
	## Lead (Message Details)
      "id": "b3b7adb2-63c5-4209-92bb-c6d84e17d2ea",
      "value": "I would like to apply for this job position, I have 5 years experience and working with 7 companies before, I am known for my adaptability, efficiency, and problem-driven approach in handling customer issues with high success rate and satisfaction."
    },
    {
	## Desired Position (Careers)
      "id": "9bcedea3-e179-490c-84a3-13b8944f805c",
      "value": "Customer Service"
    }
  ]
}





