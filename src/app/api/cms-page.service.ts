import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CmsPageService {
  constructor() {}

  public CMS_JSON = {
    rspca_partnership: {
      title: "RSPCA Partnership",
      content:
        '<img style="max-width: 300px; width: 100%; margin-bottom: 10px;" src="https://dev.petcloud.com.au/img/pages/rspca-qld.jpg" class="hoverZoomLink"> <p>When you book with PetCloud, you are helping to change the lives of pets and people everywhere. Read more about our <a href="/social-impact" rel="nofollow" target="_blank">Social Impact</a>.</p> <p>PetCloud also has a partner agreement where our Customer Support is provided by RSPCA\'s National Call Centre, making us a radically transparent and a trusted sharing economy organisation.</p> <p>In order to reach and maintain our high animal welfare and human safety standards, we conducted workshops with highly skilled and experienced staff from the RSPCA (Inspectors, Foster Carers, Dog Trainers, and Senior Veterinary Staff) to develop processes, procedures, and information for our Sitters to reduce the risk of loss or harm to pets in care and the humans that care for them.</p> <p><b>There are many things that set us apart such as:</b></p><ul><li>Mandatory Police Background Checks of all Sitters who have access to Pet Owners homes.</li><li>Animal Cruelty History checks of all RSPCA Qld Accredited Sitters</li><li>We provide a Property Checklist to support Pet Owners & Sitters in decreasing the risk of escape or harm to pets - which has been developed & approved RSPCA Qld Vets</li><li>We support our Sitters by offering an online Accredited Pet Sitter Course which covers emergency procedures & animal care standards</li><li>We also support Sitters & Pet Owners with a knowledge portal filled with Answers to FAQs & contact details for RSPCA Support Services, Animal Emergency Service Network & Vet Chat Video Consultations</li><li>We remain compliant with each State\'s Boarding Code of Practice</li><li>We support local council laws & provide relevant information to Pet Owners & Sitters in relation to caring for Domestic Animals at home and in public areas.</li><li>We promote responsible pet ownership and understand that pet owners can be time poor - so most of our sitters provide pet taxi services to help take pets to vet & grooming appointments.</li><li>We pay for liability insurance cover for all bookings.</li><li>We enable Pet Owners to post ratings and reviews on Sitter listings after a booking so other Owners can read about their experience.</li><li>We display Pet Sitter badges so Pet Owners can understand what verifications and checks have been done.</li><li>We save Pet Owners time by offering the ability to post a job and have available sitters apply to them - instead of spending time searching through sitter listings and making enquiries.</li><li>We\'re a 100% Australian company, with Australian founders.</li></ul>',
    },
    social_impact: {
      title: "Social Impact",
      content:
        '<h3>Together we can be a force for good & redefine what success means in business.</h3><h2>$$$$</h2><p>Income generated for the Australian community through job creation </p><h2>22,000</h2><p>Number of Sitters and walkers who have been provided Accredited courses for free.</p><h2>$$$$</h2><p>We give back annually to RSPCA Qld for use of their National Call Centre Services</p><h2>100K+</h2><p>Pets helped through connecting Pet Owners with affordable care</p><h4>We achieve 5 of the goals in the 2030 Agenda for Sustainable Development by the U.N.</h4><ol><li>No Proverty </li><li>Ensure healthy lives and promote well-being for all at all ages</li><li>Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all</li><li>Achieve gender equality and empower all women and girls </li><li> Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.</li></ol><img src="https://www.petcloud.com.au/img/pages/un.png" alt="Development Goals" style="width: 300px;"> <hr> <img src="https://www.petcloud.com.au/img/pages/social-impact/1.png" alt="" style="width: 300px;"> <h3> Human Issues in our Communities</h3> <p>Loneliness in Isolated Seniors - in 2016, the proportion of Australians aged 65 and over was 15%</p><p>Mental Health Sufferers - One in five (20%) Australians aged 16-85 experience a mental illness in any year</p><p>Students needing extra part-time income, flexible around their studies - Universities have more than one million enrolled students in Australia.</p><p>Stay at home Mums & Dads - needing extra income. There were approximately 80,000 families with stay-at-home fathers. This represented 4.6% of two-parent families. In comparison, there were 498,900 families with stay-at-home mothers.</p><p>PTSD Sufferers - About 12% of people living in Australia will experience PTSD in their lifetime.</p><p>Young families needing extra income - there were $1.4M couples with young children in the Australia in 2016</p><p>Victims in DV situations needing to locate affordable pet care - Violence against women is estimated to cost the Australian economy $22 billion a year.</p><p>There were 55,000 women who are discouraged job seekers in Australia(ABS 2013)</p><p>There are 1 million women in Australia who have high or severe financial vulnerability or stress. NAB/CSI/ABS 2015</p><img src="https://www.petcloud.com.au/img/pages/social-impact/2.png" alt="" style="width:300px;"> <h3> Ways we help the Community</h3> <p>Australian women need an alternative to mainstream employment. PetCloud creates an avenue through which they can create an income that is flexible and works around the barriers that they\'re facing and empowers them through pet job opportunities.</p><p>We have a percentage of our Pet Sitters and Dog Walkers who have used the Pets in Crisis Program who have now become Pet Sitters.</p><p>Seniors are less isolated and feel happier and have extra income through Pet Sitting and Dog Walking.</p><p>More PTSD sufferers are on thepath to recovery through regular exercise, community purpose, and connection.</p><p>Happier physically and mentally Healthier population - research shows that people with pets tend to do more exercise, which is good for heart health, is a natural de-stressor, and antidepressant.</p><p>Families can earn extra income to pay for school fees, uniforms, excursions & technology.</p><p>Parents & Kids pet sitting together - teaches kids responsible pet ownership and money management, along with trust, compassion, money management, respect, builds self-esteem, patience, provides physical activity, and social skills.</p><hr> <img src="https://www.petcloud.com.au/img/pages/social-impact/3.png" alt="" style="width:300px;"> <h3> Community Issues Pet Owners face</h3> <p>Australia is a nation of travellers.</p><p>Baby Boomers, Family Holiday Makers, Couple Holiday Makers, Corporate Frequent Flyers, Cruise Addicts - In 2017, 10.3 million international outbound trips were taken by Australians, and there were 97,000 overnight domestic trips and 350,000 nights away.</p><p>Hospitalised Pet Owners - 11 million Australians are hospitalised every year. Two thirds of those will own pets that will need Care.</p><p>Shiftworkers, There are 1.4 million shift workers, making up 16% of employees.</p><p>FIFO Miners or Defence Staff - According to the Australian Bureau of Statistics the total resources sector workforce in Western Australia was 96,200 in May 2015</p><p>Single, Divorced, who are time-poor Pet Owners without a network to rely on</p><p>We believe that behind every pet needing care, is a time-poor, disconnected Pet Owner who doesn\'t have a family or friends network they can rely on.</p><p>Pets needing care with travelling Owners. Australia one of the highest rates of Pet ownership in the world: 33 million pets. 2 in 3 households (65%) own a pet of some kind.</p><img src="https://www.petcloud.com.au/img/pages/social-impact/4.png" alt="" style="width:300px;"> <h3> Ways we help Pet Owners</h3> <p>For many Pet Owners who need to travel, PetCloud is a travel enabler. Pet Owners can search and connect with a local Sitter through PetCloud.</p><p>PetCloud creates greater work / life balance: Pet Owners can post a job on PetCloud to have their pet exercised or cared for. Pet Taxis can even take pets to the vet or groomers without Pet Owners needing to sacrifice an annual leave day.</p><p>Pet Owners are able to travel to attend work or family meetings without feeling worried or guilty.</p><p>Shiftworkers will be able to sleep better during the day from less noise, leading to higher job precision and tolerance.</p><p>PetCloud connects Pet Owners to quality animal lovers in their local community. PetCloud helps to provide happier, connected communities. Many Pet Owners have been thrilled to meet neighbouring Sitters and Walkers who have ended up becoming life-long friends. </p><hr> <img src="https://www.petcloud.com.au/img/pages/social-impact/5.png" alt="" style="width:300px;"> <h3> Issues Pets face</h3> <p>Kennels are proven to be stressful for pets, can smell/ unhygienic, constantly noisy, can spread viruses and disease, can have an Impersonal approach, and sometimes face overbooking or overcrowding.</p><p>Peak periods mean all the city kennels are booked out with limited alternatives.</p><p>Pets can be neglected due to changed schedules or priorities of Pet Owners leading to less time spent with dog and less exercise, leading to problem barking. Barking dogs are a growing problem for councils as families are too busy to play with them/be home.</p><p>Some pets risk being abandoned at holiday time or if a Pet Owner has had to move house and due to a lack of options and money, they have been dumped by the road, at the RSPCA, or left at the previous property.</p><p>Some pets are at risk of being used as a pawn to keep a victim of DV in a relationship.</p><img src="https://www.petcloud.com.au/img/pages/social-impact/6.png" alt="" style="width:300px;"> <h3> Ways we help Pets</h3> <p>Pet Sitting through PetCloud allows families to trial different breeds and types of animals before committing to a pet long term, improving long term pet adoption success rates.</p><p>Removes the stress of kennels and lack of hygiene by using real home</p><p>PetCloud reduces barking complaints. Pet Owners can post a job on PetCloud to have their pet exercised, pet sat, or taken to the vet or groomers. Healthier, happier pets.</p><p>Less surrendered pets through couples or singles having no options - PetCloud allows Pet Owners to book their pet to stay with a Sitter as long as they need.</p><p>PetCloud achieves one of RSPCA Qld’s own objectives: to reduce the rate of animal abandonment at holiday time by providing trusted local, affordable pet care,.</p><p>PetCloud is part owned by RSPCA Qld we give back $$$$ to their Call Centre, this keeps us accountable and radically transparent to our customers and supports the rescue work they do.</p>',
    },
    how_it_works: {
      title: "How it works",
      content:
        '<h2>The complete picture in minutes</h2><p>See all your bookings and conversations together. PetCloud automatically pulls all your pets information into one place, so you can finally get the entire picture.</p><img src="https://www.petcloud.com.au/img/pages/how-it-works/complete-picture.jpg" style="width: 300px;"><h1>How PetCloud Works for Pet Carers</h1><img alt="" src="https://www.petcloud.com.au/img/how-it-works-slider/createlisting.png"><h4>Create your Listing</h4><p>Pet Owners need to know about your home, existing pets, and whether their pet will be safe.</p><img alt="" src="https://www.petcloud.com.au/img/how-it-works-slider/promote.png"><h4>Promote, Apply, Respond</h4><p>Promote your listing with flyers in your neighbourhood. Share your listing across facebook and instagram. Apply to pet jobs posted on our jobs board. Respond to inquiries from Pet Owners.</p><img alt="" src="https://www.petcloud.com.au/img/how-it-works-slider/connect.png"><h4>Connect</h4><p>Meet Pet Owners & their pets. Understand their care routine, health & habits, introduce them to your own pets. Assess whether your home & pets are a good match for the size and temporament of their pet.</p><img alt="" src="https://www.petcloud.com.au/img/how-it-works-slider/pack.png"><h4>Feed, Cuddle & Exercise</h4><p>This contains your contact details so that we can communicate with you.</p><img alt="" src="https://www.petcloud.com.au/img/how-it-works-slider/reviewminder.png"><h4>Get reviewed & paid</h4><p>After the stay Pet Owners will provide a review, and you\'ll get paid by PetCloud into your Paypal account.</p><h2>Your pet\'s life, in one place and easy to understand.</h2><p>We gather all your pets information into one place, giving you the whole picture in a way that\'s easy to understand and access from anywhere. Add vaccination reminders. See what bookings you have and what Sitters are in your area.</p><img src="https://www.petcloud.com.au/img/pages/how-it-works/simple-free.jpg" style="width:300px;"><h3>Simple and free to set up</h3><p>It\'s free and easy to get started. In just minutes, you can create a profile, your pet\'s profile, and if you want to do pet sitting, create a listing to advertise your services.</p><img src="https://www.petcloud.com.au/img/pages/how-it-works/stay-up-to-date.jpg" style="width:300px;"><h3>Stay up-to-date as it happens</h3><p>Sitters listed on PetCloud will send you daily updates about your pet and real time. You\'ll know what your pet has been up to with their eating, sleeping and exercise.</p><img src="https://www.petcloud.com.au/img/pages/how-it-works/in-control.jpg" style="width:300px;"><h3>You\'re in control</h3><p>With cashless secure online payments, easy to understand trust badging, and icons of verifications undergone, and service reviews system, you know who you\'re meeting up with, their level of experience and other customers experience with that person.</p><h1>How PetCloud Works for Pet Owners</h1> <img alt="" src="https://www.petcloud.com.au/img/how-it-works-slider/search.png"><h4>Post a Job</h4><p>Create a Profile for you & your Pet, Connect your Credit Card to your PetCloud Account, then post a job. </p><img alt="" src="https://www.petcloud.com.au/img/how-it-works-slider/promote.png"><h4>Sitters Apply</h4><p>Available, local, insured Pet Sitters & Dog Walkers will apply. Browse their listings, read reviews, see photographs, check verifications & training achieved.</p><img alt="" src="https://www.petcloud.com.au/img/how-it-works-slider/connect.png"><h4>Meet & Greet</h4><p>Meet & Greet your chosen Sitter to check for your pet\'s compatability with them, their pets, & property. Your pets are not staying just yet. This is to interview the Sitter & check their property is escape proof & hazard-free together.</p><img alt="" src="https://www.petcloud.com.au/img/how-it-works-slider/thumbs-up.png"><h4>Was it a Match?</h4><p>PetCloud will ask you whether you felt the Sitter, Property, & Pets were compatable with your Pets. Thumbs Up = Your Card wil be charged. Thumbs down = the auth drops off your card and you can make contact with other preferred Sitters.</p><img alt="" src="https://www.petcloud.com.au/img/how-it-works-slider/pack.png"><h4>Pack & Travel</h4><p>Pack your Pet\'s bags and drop them off. Receive daily photo updates, insurance, & Customer Support.</p><img alt="" src="https://www.petcloud.com.au/img/how-it-works-slider/review.png"><h4>Review & Release</h4><p>Pick up your pet & leave a review telling other Pet Owners how it went. We then release the funds once both parties are happy.</p>',
    },
    terms_service: {
      title: "Terms of service",
      content:
        '<div class="page-contents"> <p>To become a member of Pet Cloud Pty Ltd ABN: 59 603 898 862 (PetCloud hereon) you must&nbsp;read and agree to the terms and conditions set out below together with the privacy policy.</p>                <p>By registering as a member of PetCloud you agree to the terms and conditions as set out below and as&nbsp;amended from time to time:</p>                <p><br>                    <strong>1. Definitions for the purposes of this website:</strong></p><ul>                    <li>(a) “Minder” means a member who, for a fee, looks after a pet owner’s pet or pets on terms and conditions as agreed between the pet owner and the pet minder</li>                    <li>(b) “Owner” means a member who owns or is responsible for a pet</li>                    <li>(c) “Member” means a person who upon payment of the application fee contained on this website or registering on this website agrees to the terms and conditions herein</li>                </ul>                <p><br>                    <strong>2. PetCloud is an introductory agency only and:</strong></p>                <ul>                    <li>(a) will use reasonable endeavors to match a pet owner with a pet minder;</li>                    <li>(b) does not directly or indirectly employ the pet minder;</li>                    <li>(c) has the right, in its absolute discretion, to refuse to provide services to a pet owner or a pet minder;</li>                    <li>(d) is not involved in the negotiations between members or for supervising the transactions that take place between its members.</li>                    <li>(e) has no control of the contents posted by members and cannot ensure or guarantee the accuracy or legality of any such content; and</li>                    <li>(f) is not involved in the transaction between members and is not a party to any transactions that take place between its members.</li>                </ul>                <p><br>                    <strong>3. The pet minder and pet owner will act reasonably</strong> to enter into an agreement whereby the pet minder will agree to house and care for the pet owner’s animal/s at a price and for a term on terms as agreed. PetCloud has no responsibility for the terms of the agreement entered nor for the collection of any monies due or payable. The pet owner and the pet minder do not reply upon representations made by or on behalf of PetCloud and rely entirely upon their own enquiries as to suitability of the pet minder to provide services for the pet owner.<br>                    <br>                    <strong>4. PetCloud accepts no responsibility for:</strong></p>                <ul>                    <li>(a) any incidental, indirect or consequential damages which may occur to any person or animal as a result of using the PetCloud service, or by any act or omission of a pet minder or of any pet owner or animal;</li>                    <li>(b) the behavior and/or conduct of other members or their animals;</li>                    <li>(c) the suitability, honesty, capability or character of any member;</li>                    <li>(d) the suitability of the pet minder’s premises for the pet owner’s animal/s;</li>                    <li>(e) any incidental, direct, indirect or consequential damage that may be caused to any personal or animal, whether as a result of omission, accident, injury, aggravation or otherwise; and</li>                    <li>(f) any monies due and payable either by or to the pet owner or the pet minder.</li>                </ul>                <p><br>                    <strong>5. You irrevocably release PetCloud, its directors and employees absolutely from all liability and responsibility</strong> for injury, damages, illness, accident, death, veterinary expenses, loss of property howsoever arising which may occur to any animal or person at any time as a result of the use of this introductory agency. You agree to indemnify, and keep indemnified, PetCloud, its directors and employees from and against all liability, damages, veterinary expenses, claims, actions and costs of defending such claims and action whatsoever in respect thereof.<br>                    <br>                    <strong>6. PetCloud does not make any warranty</strong> as to:</p>                <ul>                    <li>(a) the suitability, honesty, capability or character of the pet minder;</li>                    <li>(b) the suitability of the pet minder’s premises;</li>                    <li>(c) the nature or temperament of any pet; and</li>                    <li>(d) the capability of a pet minder to adequately exercise and care for any pet</li>                    <li>and does not accept any responsibility in relation to these matters.</li>                </ul>                <p><br>                    <strong>7. PetCloud is not responsible for any computer viruses or breakdowns</strong> which may arise as a result of using this service.<br>                    <br>                    <strong>8. All correspondence and emails that you receive from PetCloud or a member of PetCloud are confidential</strong>. You are not permitted to forward these emails to another party without first obtaining the consent of the original sender.<br>                    <br>                    <strong>9. All costs and expense displayed on this website are non-refundable. </strong>You are responsible for all charges associated with the use of PetCloud. If you are a pet owner, you are also separately responsible for all costs and expenses incurred by the pet minder as agreed between you and the pet minder.<br>                    <br>                    <strong>10. PetCloud is not responsible for any information or materials </strong>posted or transmitted via its website.<br>                    <br>                    <strong>11. PetCloud is not responsible for resolving disputes </strong>between members.<br>                    <br>                    <strong>12. Members are responsible for their own online charges from internet service providers</strong> and all associated and incidental costs.</p>                <p><strong>13.&nbsp;All members agree that, in relation to personal information of other members that are&nbsp;obtained through this website or through PetCloud facilitated transaction; that&nbsp;information will not be used for any unsolicited commercial purpose.</strong> Members are&nbsp;expressly prevented from adding personal information of other members to any electronic&nbsp;or physical mailing lists, or for sending spam or other content not expressly authorised by&nbsp;PetCloud.</p>                <p><strong>14.&nbsp;PetCloud is not responsible for any losses or damages</strong> that result from loss of&nbsp;user ID and/or password.</p>                <p><strong>15. PetCloud may, in its absolute discretion, amend or alter the content of a member profile.</strong> This includes but is not limited to the removal of company names, URL links and inappropriate or offensive material as deemed so by us.</p>                <p><strong>16.&nbsp;PetCloud may, in its absolute discretion, cancel a membership for any breach&nbsp;</strong>of these terms and conditions as amended from time to time.</p>                <p><strong>17.&nbsp;PetCloud may amend the terms and conditions from time to time.</strong> If you do&nbsp;not agree with any of our terms and conditions, you must terminate your membership. If,&nbsp;after changes to our terms and conditions you continue to be a member of PetCloud, you will be considered to have accepted the varied terms and conditions.</p>                <p><strong>18. As part of using this site, you agree that your&nbsp;details will be cross-checked with the RSPCAs Animal Cruelty Register </strong>and if membership is deemed not appropriate by PetCloud staff or the RSPCA, then your membership will be terminated.</p>                <p><strong>19.&nbsp;As part of using this site, you agree that your pet is not listed on an dangerous dog register. </strong>You also agree to have your&nbsp;pets details&nbsp;cross-checked with the RSPCAs Dangerous Dog Register and if found to be listed as a dangerous dog, they will not be eligible to use this Minding service.</p>                <p><strong>20. By becoming a Pet Sitter or offer Pet Services through PetCloud, you agree that you are 18 years of age or that you have permission and supervision from your parents. </strong>PetCloud takes no responsibility for any child who has not requested permission&nbsp;and supervision.</p>            	<p><strong>21. I agree that I will not refer or discuss any users to any other pet service</strong> as I realise PetCloud spends time &amp; money in working to promote Sitters. If I choose to violate these conditions, PetCloud Admin may choose to terminate my membership permanently.</p>				<p><strong>22. I agree that I will not volunteer my phone number, email, or address</strong> to any users before a paid booking has taken place and will only be provided to users after a payment for a booking has occurred.</p>				<p><strong>23. I agree to pay for any bookings I make up front before my holiday begins.</strong> In not doing so, I take full responsibility for all costs incurred, should my booking be cancelled for non-payment.</p>				<p><strong>24. If I run a Pet Care business on PetCloud, I agree to displaying a clear personal profile picture</strong> and agree that I will not display my business name or logo on my listing, as I accept that PetCloud is built on personal relationships and trust.</p>								<p><strong>25. In the event of an approved insurance claim, $500 excess fee is payable to PetCloud (to be paid by the sitter)</strong> before reimbursement money is sent to the nominated bank account. All claims are subject to the applicable policies as specified by relevant underwriters.</p><p><strong>26. Ongoing Relationship with PetCloud</strong> You have an ongoing relationship with PetCloud and every booking, including subsequent bookings with the same client (Pet Owner) or pet service provider (Pet Sitter / Dog Walker) must go through the PetCloud platform.</p>				<p><strong>27. REFUNDS AND CANCELLATIONS POLICY:</strong> Users understand and acknowledge that the Pet Services may be subject to statutory guarantees under Australian Consumer Law and any other applicable laws. Nothing in these Terms operates to exclude or limit the operation of such guarantees in any manner contrary to law.</p>				<ul>                    <li> <strong>Cancellation by a Pet Sitter/service provider:</strong> If a pet sitter cancels prior to start or during a booking, we will refund the booking fees paid by the pet owner for the services not provided. PetCloud will try to arrange a substitute pet sitter to cover a confirmed booking. A pet sitter may try to find an alternate service provider to cover for any remaining days with mutual agreement of all the parties involved including PetCloud to modify the booking and ensure a seamless experience.<br>					If you are a pet sitter and you frequently cancel confirmed and accepted bookings without any justifications, Pet Cloud reserves the right to terminate your account.					</li>					<li> <strong>Cancellation by a Pet Owner:</strong> If a pet owner cancels prior to the start of a booking then the Sitter’s chosen refund policy at the time of creating that booking will apply, subject to a $20 cancellation and administration fees. The Pet Owner must notify PetCloud in writing at service@petcloud.com.au . Petcloud’s representative will consider notice receipt time, circumstances of the complaints, withholding period of booking amount, sitter’s refund policy or any other relevant factors before processing any refunds. Three types of refund policies which a sitter, as a provider of pet care services, can choose are below;<br>						<strong>Conditions for FULL Refunds:</strong><br>						<strong>Flexible Policy:</strong> Pet owner is eligible for a full refund if PetCloud receives the cancellation request 24hours before the commencement of the booking.<br>						<strong>Moderate Policy:</strong> Pet owner is eligible for a full refund if PetCloud receives the cancellation request <u>7 days before</u> the start of a booking.<br>						<strong>Strict Policy:</strong> Pet owner is eligible for a full refund if PetCloud receives the cancellation request <u>14 days before</u> the start of a booking.<br>						<strong>Capped Partial Refunds:</strong> Where a Pet Owner is not eligible for a full refund, PetCloud will forfeit 50% or A$300 whichever is lower over and above $20 cancellation fee. This is a cost to cover Pet Siter’s compensation, administration expenses to set the booking, maintenance of website, advertising, training and other related costs.<br>						If a pet owner cancels a current booking (after the start but before the end date), we will refund the booking fees paid by the pet owner for the services not yet provided subject to a $20 cancellation fee and the Capped Partial Refunds clause above.<br>						<strong>Refunds after a payout:</strong> Sitter will get paid after a pet owner confirms completion of a booking on PetCloud or after 3 business days after completion. Cancellation request/complaints received after payment has been made to the Pet Sitter will warrant discussions with both parties and will involve recovery of paid funds from the sitter. PetCloud will pay to the Pet Owner only after receiving money back from the sitter, Pet Owner understand that any delays are beyond the control of PetCloud.<br>					</li>					<li><strong>Cancellation of Recurring Bookings:</strong> weekly recurring bookings that run for more than 2 weeks and for which Pet Cloud collects weekly payments. All the above policies will apply in cases where booking is cancelled before its start date except the amount in consideration will be for 2 weeks.					</li>                </ul>				<p><strong>Force Majeure:</strong> The cancellation policies described herein may not apply in the event of certain emergency situations beyond the control of Pet Sitters and/or Pet Owners that make it impossible or impractical to perform agreed Bookings, such as evacuations resulting from earthquake, hurricane, bushfire, flood, war, riots, pandemic situation or other similar disaster. In such cases PetCloud may, in its reasonable discretion, issue refunds under terms that vary from a Pet Sitter’s selected cancellation policy.</p>			</div>',
    },
    news_media: {
      title: "News& Media",
      content:
        '<div class="page-contents"><div class="row"><div class="col-sm-12 hidden-xs"><img style="margin-bottom: 20px;" class="img-responsive" alt="Press Media Strip" src="https://dev.petcloud.com.au/img/pages/press-media-strip.png"></div></div><hr><div class="row"><div class="col-sm-3"><a rel="nofollow" href="https://vetpracticemag.com.au/baby-boomers-dominate-pet-sharing-economy/" target="_blank">' +
        '<img class="img-responsive" alt="go55s.com.au" src="https://dev.petcloud.com.au/img/homepage/featured/VP-banner.jpg">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://vetpracticemag.com.au/baby-boomers-dominate-pet-sharing-economy/" target="_blank"><h3 style="margin-top: 0px;">Baby boomers dominate pet sharing economy</h3>                        </a>  <p>New research from Brisbane-based company PetCloud shows that while only three per cent of their pet carers offering services are over the age of 55, they complete over 20 per cent of all jobs.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://startsat60.com/money/retirement/pet-loving-baby-boomers-have-hit-on-a-cute-source-of-extra-cash/" target="_blank"><img class="img-responsive" alt="go55s.com.au" src="https://dev.petcloud.com.au/img/homepage/featured/60-logo-money.svg">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://startsat60.com/money/retirement/pet-loving-baby-boomers-have-hit-on-a-cute-source-of-extra-cash/" target="_blank"><h3 style="margin-top: 0px;">Taxi service takes pets to vets</h3>                        </a>                        <p>Baby Boomers are kicking ass (not literally, of course, because they’re animal lovers) and taking names when it comes to pet sitting, taking way more bookings and out-earning than younger rivals, new data show.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://vetpracticemag.com.au/taxi-service-takes-pets-vets/" target="_blank"><img class="img-responsive" alt="go55s.com.au" src="https://dev.petcloud.com.au/img/homepage/featured/VP-banner.jpg">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://vetpracticemag.com.au/taxi-service-takes-pets-vets/" target="_blank"><h3 style="margin-top: 0px;">Taxi service takes pets to vets</h3>                        </a>                        <p>With Australians working longer hours than ever before, it is often their pets that suffer the consequences—annual vaccinations are missed, grooming appointments get further apart, and desexing is put on the back burner because owners literally do not have the time to make a trip to the vet.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.go55s.com.au/lifestyle/baby-boomers-dominate-pet-sharing-economy/" target="_blank"><img class="img-responsive" alt="go55s.com.au" src="https://dev.petcloud.com.au/img/homepage/featured/go55s.jpg">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.go55s.com.au/lifestyle/baby-boomers-dominate-pet-sharing-economy/" target="_blank"><h3 style="margin-top: 0px;">Baby Boomers Dominate Pet Sharing Economy</h3>                        </a>                        <p>The sharing economy isn’t just for Gen Y’s as would be retirees are now working smarter not harder. New research from PetCloud shows while only 3% of their pet carers offering services are over the age of 55, they complete over 20% of all jobs.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.huffingtonpost.com.au/2017/10/04/how-to-get-your-great-idea-rolling-into-a-real-business_a_23231894/" target="_blank"><img class="img-responsive" alt="huffingtonpost.com.au" src="https://dev.petcloud.com.au/img/homepage/featured/huffpost-new-logo-2017.jpg">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.huffingtonpost.com.au/2017/10/04/how-to-get-your-great-idea-rolling-into-a-real-business_a_23231894/" target="_blank"><h3 style="margin-top: 0px;">How To Get Your Great Idea Rolling Into A Real Business</h3>                        </a>                        <p>Taking those first crucial steps isnt easy and many fall into the trap of thinking you need everything in place to get the ball rolling. But there are several Aussie start-ups that began with nothing more than an idea, as well as a founder that was willing to take the crucial first steps.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.talkinglifestyle.com.au/podcast/airbnb-for-pets/" target="_blank"><img class="img-responsive" alt="www.talkinglifestyle.com.au" src="https://dev.petcloud.com.au/img/homepage/featured/talkingLifestyle.png">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.talkinglifestyle.com.au/podcast/airbnb-for-pets/" target="_blank"><h3 style="margin-top: 0px;">AirBnB for Pets</h3>                        </a>                        <p>Deb Morrison – &lrm;CEO of PetCloud.com.au – chats to Kayley Harris and Nick Bennett on The Daily Drive about the sharing economy alternative to a kennel.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.huffingtonpost.com.au/entry/5-reasons-why-you-should-consider-a-daycare-for-your_us_599a9e62e4b02eb2fda32170" target="_blank"><img class="img-responsive" alt="huffingtonpost.com.au" src="https://dev.petcloud.com.au/img/homepage/featured/huffpost-new-logo-2017.jpg">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.huffingtonpost.com.au/entry/5-reasons-why-you-should-consider-a-daycare-for-your_us_599a9e62e4b02eb2fda32170" target="_blank"><h3 style="margin-top: 0px;">5 reasons why you should consider a daycare for your dog</h3>                        </a>                        <p>Most dogs are left alone while owners goes to work leaving the dog lonely. This often result into stress, disobedience and excessive barking. Here are five reasons why you should consider a dogie day care.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.themartec.com/insidelook/25-women-founders" target="_blank"><img class="img-responsive" alt="themartec.com.au" src="https://dev.petcloud.com.au/img/homepage/featured/themartec.jpg">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.themartec.com/insidelook/25-women-founders" target="_blank"><h3 style="margin-top: 0px;">25 Top Women-Founded Startups to Watch</h3>                        </a>                        <p>Here is our round-up of 27 fierce ladies, in 25 startups to keep an eye on taking the ANZ tech space by storm.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.mydeal.com.au/blog/post/cheap-activities-school-holidays" target="_blank"><img class="img-responsive" alt="Mydeal.com.au" src="https://dev.petcloud.com.au/img/homepage/featured/mydeal_weblogo.png">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.mydeal.com.au/blog/post/cheap-activities-school-holidays" target="_blank"><h3 style="margin-top: 0px;">Cheap Activities To Entertain The Kids On School Holidays</h3>                        </a>                        <p>The best part about school holidays is not having to worry about that morning rush getting the kids out of bed, fed, dressed and out the door. The worst part is keeping those active minds entertained day in, day out. So here’s some ideas to take the stress back out of school holidays.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.mydeal.com.au/blog/post/professional-pet-mental-health" target="_blank"><img class="img-responsive" alt="Mydeal.com.au" src="https://dev.petcloud.com.au/img/homepage/featured/mydeal_weblogo.png">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.mydeal.com.au/blog/post/professional-pet-mental-health" target="_blank">' +
        '<h3 style="margin-top: 0px;">5 Ways To Improve The Mental Health And Wellbeing Of Your Pet, From These 3 Pet Experts</h3>                        </a>                        <p>Pets are some of the greatest things in life. They listen to you without hesitation, they love you unconditionally and they only want to help you. This doesn’t mean they don’t need some love in return. In fact, their mental health is a huge factor that owners will often overlook, so we’ve gathered a few experts who can help you improve and maintain your fur baby’s mental health and wellbeing.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.facebook.com/9NewsDarwin/videos/1531732570199043/" target="_blank"><img style="width: 45%;" class="img-responsive" alt="9 News Darwin" src="https://dev.petcloud.com.au/img/homepage/featured/9-news-darwin.jpg">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.facebook.com/9NewsDarwin/videos/1531732570199043/" target="_blank"><h3 style="margin-top: 0px;">ANIMAL AIRBNB</h3>                        </a>                        <p>If you love animals - and making money - theres now a way you can combine the two, right here in Darwin..</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.themartec.com/insidelook/25-brisbane-startups-to-watch" target="_blank"><img class="img-responsive" alt="TheMartec" src="https://dev.petcloud.com.au/img/homepage/featured/themartec.jpg">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.themartec.com/insidelook/25-brisbane-startups-to-watch" target="_blank"><h3 style="margin-top: 0px;">25 Brisbane Startups to Watch in 2017</h3>                        </a>                        <p>Now it is time for Brisbane, Australias third largest city, to get some cred. The startup scene in Brisbane is growing. Of course, the market is smaller than in Sydney and Melbourne but that does not mean this city is failing to innovate.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.byronnews.com.au/news/say-i-do-to-having-pets-at-your-wedding/3202389/" target="_blank"><img class="img-responsive" alt="ByronNews" src="https://dev.petcloud.com.au/img/homepage/featured/byronnews.png">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.byronnews.com.au/news/say-i-do-to-having-pets-at-your-wedding/3202389/" target="_blank"><h3 style="margin-top: 0px;">Say I do to having pets at your wedding</h3>                        </a>                        <p>HAVING your fur babies at your wedding isnt just for celebrities, a Byron Bay wedding has showed.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://womenindigital.org/theres-no-pawsing-journey-entrepreneurship/" target="_blank"><img class="img-responsive" alt="WomenInDigital" src="https://dev.petcloud.com.au/img/homepage/featured/wid.png">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://womenindigital.org/theres-no-pawsing-journey-entrepreneurship/" target="_blank"><h3 style="margin-top: 0px;">There’s no pawsing in a journey to Entrepreneurship</h3>                        </a>                        <p>Deb Morrison, Founder and CEO of Pet Cloud built the perfect solution for online pet sitting after months of continuous networking and prototyping.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.news-mail.com.au/news/say-i-do-to-having-pets-at-your-wedding/3202389/" target="_blank"><img class="img-responsive" alt="News-Mail" src="https://dev.petcloud.com.au/img/homepage/featured/news-mail.png">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.news-mail.com.au/news/say-i-do-to-having-pets-at-your-wedding/3202389/" target="_blank"><h3 style="margin-top: 0px;">Say I do to having pets at your wedding</h3>                        </a>                        <p>Pet Cloud is an online community enabling pet parents to continue travelling while their pets are cared for through real time updates, insurance and RSPCA approval.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.morgans.com.au/Blog/2017/July/Startup-Series-Podcast-Deb-Morrison-PetCloud.aspx" target="_blank"><img class="img-responsive" alt="Morgans RNB" src="https://dev.petcloud.com.au/img/homepage/featured/rbs-morgans-logo.jpg">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.morgans.com.au/Blog/2017/July/Startup-Series-Podcast-Deb-Morrison-PetCloud.aspx" target="_blank"><h3 style="margin-top: 0px;">Startup Series: Deb Morrison, Founder And Chief Executive Oficer of PetCloud</h3>                        </a>                        <p>In the latest Morgans Startup Series, Morgans Adviser Chris Titley spoke with Deb Morrison, Founder and CEO of PetCloud. PetCloud is Australias trusted RSPCA approved Pet Sitters. </p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.qt.com.au/news/say-i-do-to-having-pets-at-your-wedding/3202389/" target="_blank"><img class="img-responsive" alt="Queensland Times" src="https://dev.petcloud.com.au/img/homepage/featured/qt.png">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.qt.com.au/news/say-i-do-to-having-pets-at-your-wedding/3202389/" target="_blank"><h3 style="margin-top: 0px;">Say I do to having pets at your wedding</h3>                        </a>                        <p>A Goldcoast local who got married at the Fig Tree Restaurant said she had a great experience using the wedding pet concierge service to make sure her dog was there to see her walk down the isle.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://internetretailing.com.au/pet-startup-partners-major-retailer/" target="_blank"><img class="img-responsive" alt="internetretailing.com" src="https://dev.petcloud.com.au/img/homepage/featured/Internet-retailing.jpg">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://internetretailing.com.au/pet-startup-partners-major-retailer/" target="_blank"><h3 style="margin-top: 0px;">Pet Startup Partners with Major Retailer</h3>                        </a>                        <p>Australian startup PetCloud is gearing up to expand across the country through a new partnership with Greencross Limited, which owns Petbarn.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.flightcentre.com.au/travel-news/destinations/pets-can-play-while-youre-away-with-petcloud" target="_blank"><img class="img-responsive" alt="Flight Centre" src="https://dev.petcloud.com.au/img/homepage/featured/flight-centre-logo.png">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.flightcentre.com.au/travel-news/destinations/pets-can-play-while-youre-away-with-petcloud" target="_blank"><h3 style="margin-top: 0px;">Pets Can Play While Youre Away With PetCloud</h3>                        </a>                        <p>As Aussies we are also big travellers but unfortunately pet ownership and travelling dont mix – until now, until PetCloud.</p>' +
        '</div></div>  <hr> <div class="row"><div class="col-sm-3"> <a rel="nofollow" href="https://www.seniorsnews.com.au/news/how-to-spend-less-so-you-can-travel-more/3139285/" target="_blank">  <img class="img-responsive" alt="Seniors News" src="https://dev.petcloud.com.au/img/homepage/featured/seniors-news.png">' +
        '</a></div><div class="col-sm-9"><a rel="nofollow" href="https://www.seniorsnews.com.au/news/how-to-spend-less-so-you-can-travel-more/3139285/" target="_blank"><h3 style="margin-top: 0px;">How to Spend Less So You Can Travel More</h3> </a><p>FOR THOSE looking to save money for travel but are unsure where to start, we offer our top 5 tips to learn how to spend less.</p></div></div>+<hr><div class="row"><div class="col-sm-3"> <a rel="nofollow" href="https://www.traveltrends.biz/ttn555-petcloud-aims-to-disrupt-pet-sitting-for-travellers/" target="_blank"><img class="img-responsive" alt="TRAVEL TRENDS" src="https://dev.petcloud.com.au/img/homepage/featured/logo-traveltrends.jpg">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.traveltrends.biz/ttn555-petcloud-aims-to-disrupt-pet-sitting-for-travellers/" target="_blank"><h3 style="margin-top: 0px;">PetCloud Aims to Disrupt Pet Sitting for Travellers</h3>                        </a>                        <p>Former Virgin Australia website exec Deb Morrison (pictured) has launched PetCloud, a new pet sitting service for travellers.</p>                    </div>                </div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.centraltelegraph.com.au/news/say-i-do-to-having-pets-at-your-wedding/3202389/" target="_blank"><img class="img-responsive" alt="Central Telegraph" src="https://dev.petcloud.com.au/img/homepage/featured/Central-Telegraph-masthead.png">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.centraltelegraph.com.au/news/say-i-do-to-having-pets-at-your-wedding/3202389/" target="_blank"><h3 style="margin-top: 0px;">Say I do to having pets at your wedding</h3>                        </a>                        <p>A website created by Lismore-born woman, Deb Morrison has taken off with more than 20,000 users across Australia taking up its offer to care for pets.</p>                    </div>                </div>                <hr>				<div class="row">					<div class="col-sm-3">						<a rel="nofollow" href="https://www.warwickdailynews.com.au/news/never-bamboozle-your-pupperino-again/3197937/" target="_blank">							<img class="img-responsive" alt="warwickdailynews.com.au" src="https://dev.petcloud.com.au/img/homepage/featured/warwickdailynews-masthead.png">						</a>					</div>					<div class="col-sm-9">						<a rel="nofollow" href="https://www.warwickdailynews.com.au/news/never-bamboozle-your-pupperino-again/3197937/" target="_blank">							<h3 style="margin-top: 0px;">Never bamboozle your pupperino again</h3>						</a>						<p>HAVE you ever felt bad when youve had to leave your beloved doggo at home alone, or in the house of someone unreliable? Now you will never have to feel guilty again when your pet gives you the sad eye treatment as you start the car up and head out of the driveway.</p>					</div>				</div>                <hr>				<div class="row">					<div class="col-sm-3">						<a rel="nofollow" href="https://www.mydeal.com.au/blog/post/save-money-whilst-travelling" target="_blank">/							<img class="img-responsive" alt="mydeal.com.au" src="https://dev.petcloud.com.au/img/homepage/featured/mydeal_weblogo.png">						</a>					</div>					<div class="col-sm-9">						<a rel="nofollow" href="https://www.mydeal.com.au/blog/post/save-money-whilst-travelling" target="_blank">							<h3 style="margin-top: 0px;">6 Ways To Save Money Overseas</h3>						</a>						<p>There’s no feeling like going somewhere new. Whether wanderlust has taken over or you’re just on a holiday, there are some handy tips you should know about to keep yourself afloat whilst travelling. Here are some easy ways you can save money whilst you’re travelling overseas.</p>					</div>				</div>                <hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.northernstar.com.au/news/say-i-do-to-having-pets-at-your-wedding/3202389/" target="_blank"><img class="img-responsive" alt="The Northern Star News" src="https://dev.petcloud.com.au/img/homepage/featured/northern-star.png">  </a></div>  <div class="col-sm-9"> <a rel="nofollow" href="https://www.northernstar.com.au/news/say-i-do-to-having-pets-at-your-wedding/3202389/" target="_blank"><h3 style="margin-top: 0px;">Say I do to having pets at your wedding</h3>                        </a>                        <p>HAVING your fur babies at your wedding isnt just for celebrities, a Byron Bay wedding has showed.</p>                    </div>                </div>				<hr>				<div class="row">					<div class="col-sm-3">						<a rel="nofollow" href="https://www.theaustralian.com.au/federal-election-2016/federal-election-2016-turnbull-shorten-campaign-in-brisbane/news-story/f1dc8edde253eeb45f787fadfc147113" target="_blank">							<img class="img-responsive" alt="The Australian News" src="https://dev.petcloud.com.au/img/homepage/featured/the-australian.png">						</a>					</div>					<div class="col-sm-9">						<a rel="nofollow" href="https://www.theaustralian.com.au/federal-election-2016/federal-election-2016-turnbull-shorten-campaign-in-brisbane/news-story/f1dc8edde253eeb45f787fadfc147113" target="_blank">							<h3 style="margin-top: 0px;">PM meets start-up owners</h3>						</a>						<p>Malcolm Turnbull is meeting with business owners at Brisbane’s start-up community workspace River City Labs alongside assistant minister for innovation and science Wyatt Roy.</p>					</div>				</div>				<hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.businessnewsaus.com.au/articles/rspca-backs--airbnb-for-pets-.html" target="_blank"><img class="img-responsive" alt="Business News Australia" src="https://dev.petcloud.com.au/img/homepage/featured/business-news-aus.png">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.businessnewsaus.com.au/articles/rspca-backs--airbnb-for-pets-.html" target="_blank"><h3 style="margin-top: 0px;">RSPCA backs airbnb for pets</h3>                        </a>                        <p>PETS are set for a bite into the Airbnb pie, thanks to Brisbane startup PetCloud and the RSPCA.</p>                    </div>                </div>                <hr>				<div class="row">					<div class="col-sm-3">						<a rel="nofollow" href="https://www.brisbanetimes.com.au/queensland/rspca-endorses-petcloud-the-airbnb-of-pet-sitting-services-20160401-gnwesp.html" target="_blank">							<img class="img-responsive" alt="The Brisbane Times News" src="https://dev.petcloud.com.au/img/homepage/featured/brisbane-times.png">						</a>					</div>					<div class="col-sm-9">						<a rel="nofollow" href="https://www.brisbanetimes.com.au/queensland/rspca-endorses-petcloud-the-airbnb-of-pet-sitting-services-20160401-gnwesp.html" target="_blank">							<h3 style="margin-top: 0px;">RSPCA endorses Petcloud, the Airbnb of pet-sitting services</h3>						</a>						<p>The RSPCA has joined up with Airbnb-esque pet sitting service Petcloud to try to curb the number of animals surrendered each holiday period.</p>					</div>				</div>				<hr>				<div class="row">					<div class="col-sm-3">						<a rel="nofollow" href="https://www.smh.com.au/federal-politics/federal-election-2016-opinion/election-2016-behold-congregation-of-the-church-of-innovation-here-is-malcolm-20160601-gp8sl3.html" target="_blank">							<img class="img-responsive" alt="Sydney Morning Herald News" src="https://dev.petcloud.com.au/img/homepage/featured/smh.png">						</a>					</div>					<div class="col-sm-9">						<a rel="nofollow" href="https://www.smh.com.au/federal-politics/federal-election-2016-opinion/election-2016-behold-congregation-of-the-church-of-innovation-here-is-malcolm-20160601-gp8sl3.html" target="_blank">							<h3 style="margin-top: 0px;">Election 2016: Behold, congregation of the Church of Innovation, here is Malcolm</h3>						</a>						<p>Dreams. Courage. Imagination. Inspiration. Journeys. Jobs and Growth. Milly the cavoodle. Malcolm Turnbulls Church of Innovation has it all.</p>					</div>				</div>				<hr>				<div class="row">					<div class="col-sm-3">						<a rel="nofollow" href="https://twitter.com/ABCPoliPics/status/737790241570885632" target="_blank">							<img class="img-responsive" alt="ABC News" src="https://dev.petcloud.com.au/img/homepage/featured/abc-news.png">						</a>					</div>					<div class="col-sm-9">						<a rel="nofollow" href="https://twitter.com/ABCPoliPics/status/737790241570885632" target="_blank">							<h3 style="margin-top: 0px;">ABC PoliPics</h3>						</a>						<p>Meeting Milly #ausvotes 📷 by @NickHaggarty</p>					</div>				</div>				<hr>				<div class="row">					<div class="col-sm-3">						<a rel="nofollow" href="https://www.dogslife.com.au/dog-accessories/boarding-kennels/smart-pet-parents-handle-summer-holidays" target="_blank">							<img class="img-responsive" alt="Dogs Life" src="https://dev.petcloud.com.au/img/homepage/featured/dogs-life.png">						</a>					</div>					<div class="col-sm-9">						<a rel="nofollow" href="https://www.dogslife.com.au/dog-accessories/boarding-kennels/smart-pet-parents-handle-summer-holidays" target="_blank">							<h3 style="margin-top: 0px;">How Smart Pet Parents Handle Summer Holidays</h3>						</a>' +
        "<p>It’s the last few months in the lead up to Christmas in Australia.  You find yourself dreaming of being by the pool somewhere, sipping a cocktail, and being anywhere but the office. You see your friend’s posts about Bali, but then you remember," +
        'Alfie, your three year old pug and his side kick Rufus, a two year old French bulldog.</p>					</div>				</div>				<hr>                <div class="row">                    <div class="col-sm-3">                        <a rel="nofollow" href="https://www.smartcompany.com.au/startupsmart/news-analysis/local/leaving-charlie-was-more-than-a-pet-peeve-it-was-a-trust-issue-this-founder-needed-to-resolve/" target="_blank"><img class="img-responsive" alt="smartcompany" src="https://dev.petcloud.com.au/img/homepage/featured/press-smartcompany.jpg">                        </a>                    </div>                    <div class="col-sm-9">                        <a rel="nofollow" href="https://www.smartcompany.com.au/startupsmart/news-analysis/local/leaving-charlie-was-more-than-a-pet-peeve-it-was-a-trust-issue-this-founder-needed-to-resolve/" target="_blank"><h3 style="margin-top: 0px;">Leaving Charlie was more than a pet peeve, it was a trust issue this founder needed to resolve</h3>                        </a>                        <p>PetCloud is an online platform connecting busy pet owners with members of the local community that will look after the much-loved furry members of the family.</p>                    </div>                </div>                <hr>                <div class="row">					<div class="col-sm-3">						<a rel="nofollow" href="https://www.businessnewsaus.com.au/articles/sharing-economy--barking-up-the-right-tree.html" target="_blank">							<img class="img-responsive" alt="Business News Australia" src="https://dev.petcloud.com.au/img/homepage/featured/business-news-aus.png">						</a>					</div>					<div class="col-sm-9">						<a rel="nofollow" href="https://www.businessnewsaus.com.au/articles/sharing-economy--barking-up-the-right-tree.html" target="_blank">							<h3 style="margin-top: 0px;">Sharing Economy: Barking Up The Right Tree</h3>						</a>						<p>FIRST there were rooms for rent, then cars for sharing and now pets for earning - welcome Brisbane startup PetCloud to the evolving sharing economy.</p>					</div>				</div>				<hr>				<div class="row">					<div class="col-sm-3">						<a rel="nofollow" href="https://www.northernstar.com.au/news/sharing-services-airbnb-petcloud-taking-off-in-au/2924188/" target="_blank">							<img class="img-responsive" alt="The Northern Star News" src="https://dev.petcloud.com.au/img/homepage/featured/northern-star.png">						</a>					</div>					<div class="col-sm-9">						<a rel="nofollow" href="https://www.northernstar.com.au/news/sharing-services-airbnb-petcloud-taking-off-in-au/2924188/" target="_blank">							<h3 style="margin-top: 0px;">Sharing services AirBnB and PetCloud taking off in Australia</h3>						</a>						<p>COMMUNITY sharing services are becoming more and more common around the world and Australians are warming to them as well.</p>					</div>				</div>				<hr>				<div class="row">					<div class="col-sm-3">						<a rel="nofollow" href="https://www.byronnews.com.au/news/sharing-services-airbnb-petcloud-taking-off-in-au/2924188/" target="_blank">							<img class="img-responsive" alt="Byron Bay News" src="https://dev.petcloud.com.au/img/homepage/featured/byron-news.png">						</a>					</div>					<div class="col-sm-9">						<a rel="nofollow" href="https://www.byronnews.com.au/news/sharing-services-airbnb-petcloud-taking-off-in-au/2924188/" target="_blank">							<h3 style="margin-top: 0px;">Sharing services AirBnB and PetCloud taking off in Australia</h3>						</a>						<p>COMMUNITY sharing services are becoming more and more common around the world and Australians are warming to them as well.</p>					</div>				</div>				<hr>				<div class="row">					<div class="col-sm-3">						<a rel="nofollow" href="http://quest.newspaperdirect.com/epaper/showlink.aspx?bookmarkid=6UGHTUEXJZ65&amp;linkid=615331d8-17a2-487c-98ff-b67849ac278d&amp;pdaffid=UkbslQaESlx6RAGbiGNV1g%3d%3d" target="_blank">							<img class="img-responsive" alt="South East Advertiser" src="https://dev.petcloud.com.au/img/homepage/featured/south-east-advertiser.png">						</a>					</div>					<div class="col-sm-9">						<a rel="nofollow" href="http://quest.newspaperdirect.com/epaper/showlink.aspx?bookmarkid=6UGHTUEXJZ65&amp;linkid=615331d8-17a2-487c-98ff-b67849ac278d&amp;pdaffid=UkbslQaESlx6RAGbiGNV1g%3d%3d" target="_blank">							<h3 style="margin-top: 0px;">Dogs’ Day Out For Pets And Owners</h3>						</a>						<p>A NEW online service has taken the stress out of finding last-minute accommodation for pets.</p>					</div>				</div>			</div>',
    },
    service_prices: {
      title: "Services and Prices",
      content:
        '<div class="row"> <div class="col-md-12"> <div class="page-contents"> <h1 class="main_head">Services & Prices</h1> <h4 class="txt_head">All of our Pet Care Service Providers set their own prices which you will find on their listing. The below is a guide only.</h4> <br> <div class="table_wrap"> <div class="table_box"> <div class="img_box"> <img src="../../assets/img/service_pricing/PetSitting.png"> </div> <div class="content_box"> <a href="/dog-sitting" target="_blank"><h3>Pet Sitting</h3></a> <p class="p_hight">This is minding at the Sitter’s Home. The host family feeds, walks and cares for your furry friend just as lovingly as you would. Unlike at a boarding kennel, your pooch will not be locked up in a cage. They will have a second home and temporarily become a part of the host family and may feel less anxious.</p>  <h4 class="price">Price from $30-$50 per night</h4>  </div> </div> <div class="table_box"> <div class="img_box"> <img src="../../assets/img/service_pricing/DogWalking.png"> </div> <div class="content_box"> <a href="/dog-walking" target="_blank"><h3>Dog Walking</h3></a> <div class="p_hight"><p>1 on 1 dog walks in your suburb.<br>Duration: 30 mins.</p> <p>Dog Walkers will not go to dog parks or let your dog off the leash in a public area. They will only walk your dog in the cool of the early morning or evening.</p></div>  <h4 class="price">Price from $35 per walk. $5 per extra dog.</h4>  </div> </div> <div class="table_box"> <div class="img_box"> <img src="../../assets/img/service_pricing/housesitting.png"> </div> <div class="content_box"> <a href="/house-sitting" target="_blank"><h3>House Sitting</h3></a> <div class="p_hight"><p>Having a Sitter come and stay in your home in a guest room takes the stress away from putting your beloved pet in a kennel or cattery where they may come back sick or stressed. </p> <p>All our house sitters are police checked and insured to ensure that you are only connected with trusted animal lovers who will take the responsibility of looking after your pet/s seriously.</p></div>  <h4 class="price">Price from $30-$50 per night</h4>  </div> </div> <div class="table_box"> <div class="img_box"> <img src="../../assets/img/service_pricing/homevisits.png"> </div> <div class="content_box"> <a href="/house-sitting" target="_blank"><h3>Home Visits</h3></a> <div class="p_hight"><p>Home Visits are when a Pet Sitter drives over to your home, and using a spare key you have provided them beforehand at your Meet & Greet, they let themselves into your home to feed and water your pets and then they lock up, and drive home again. The visit lasts around 15 -20 mins.</p> <p>Service includes: </p><ul> <li>Daily Feeding, putting out fresh water every morning and evening</li> <li>Taking dogs on walks, and providing exercise through play</li> <li>Cleaning litter boxes + Picking up poop from the backyard and disposing of in a bag in the wheelie bin outside.</li> <li>Brushing pets + Full body checks</li> </ul> <p></p></div>  <h4 class="price">Price: Once a day 20 min visit from $45. <br> Twice Daily 20 min visits from $90</h4>  </div> </div> <div class="table_box"> <div class="img_box"> <img src="../../assets/img/service_pricing/PetTaxi.png"> </div> <div class="content_box"> <a href="/pet-taxi" target="_blank"><h3>Pet Taxi</h3></a> <div class="p_hight"><p>Pet Taxis are great to book for when your pet has a grooming appointment or has a Vet Check up appointment during the work week M-F 9-5. Also ideal for Pick up and Drop Off at the start and end of stays when you are running late or short of time.</p> <p>Approximate prices are as follows: </p> <h4 class="price">0 to 15km: from $40<br> 15km to 25km: from $55<br> 25km to 30km: from $70<br> 30km to 40km: from $99<br> over 40km: discuss at Meet & Greet for a custom quote. </h4></div>   </div> </div> <div class="table_box"> <div class="img_box"> <img alt="Grooming and Clipping" src="../../assets/img/service_pricing/Groomingandclipping.png"> </div> <div class="content_box"> <a href="/dog-grooming" target="_blank"><h3>Grooming & Clipping</h3></a> <p class="p_hight">Tidy up - face, feet, hygiene area Full Body Brush Shampoo & Conditioner Blow Dry Towel Dry Ear Cleaning.</p>  <h4 class="price">Price from $60 </h4>  </div> </div> <div class="table_box"> <div class="img_box"> <img src="../../assets/img/service_pricing/WashingandBrushing.png"> </div> <div class="content_box"> <a href="/washing-brushing" target="_blank"><h3>Washing and Brushing</h3></a> <p class="p_hight">This is a basic dog wash and brush service, good for getting fur around the eyes cleaned and their coat brushed and smelling nice.</p>  <h4 class="price">Price from $20 </h4>  </div> </div> <div class="table_box"> <div class="img_box"> <img src="../../assets/img/service_pricing/dogtrainer.jpg"> </div> <div class="content_box"> <a href="/dog-training" target="_blank"><h3>Dog Training</h3></a> <p class="p_hight">6-week, 1 hour course with a trainer who uses positive reinforcement and is registered.</p>  <h4 class="price">Price from $220 </h4>  </div> </div> <div class="table_box"> <div class="img_box"> <img src="../../assets/img/service_pricing/24hrsupervision.jpg"> </div> <div class="content_box"> <a href="/dog-walking" target="_blank"><h3>24hr Care</h3></a> <p class="p_hight">Does your pet need close monitoring and supervision? Your pet may have recently had an operation such as being desexed. The pet may need oral medication, or injections.</p>  <h4 class="price">Price from $50 per night </h4>  </div> </div> <div class="table_box"> <div class="img_box"> <img src="../../assets/img/service_pricing/DayCares.png"> </div> <div class="content_box"> <a href="/doggy-day-care" target="_blank"><h3>Day Care</h3></a> <p class="p_hight">Your pet will love staying in the company of a pet sitter at their home during the day. There may be 1 or 2 additional guest pets, unless you specifically state otherwise.</p>  <h4 class="price">Price from $50 per day </h4>  </div> </div> </div> </div> </div> </div>',
    },
    privacy: {
      title: "Privercy",
      content:
        '<div class="row"> <div class="col-md-12"> <div class="pagecontents"> <p><strong>Updated 3<sup>rd</sup> July 2015</strong></p> <p>Your privacy matters to PetCloud, Inc. (the "Company", "we", or "us"). This Privacy Policy explains how we collect, use, share and protect information about you. We also provide information regarding how you can access and update your information and make certain choices about how your information is used. At PetCloud, we want to help make your experience with our Site and other services we may offer (referred to in this policy collectively as our “Service” or “Services”) satisfying and safe.</p> <p>PetCloud allows you also to post content, including photos, comments, and other materials. Anything that you post or otherwise make available on our Products is referred to as "User Content."</p> <p>Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our <a href="/terms-of-service">Terms of Service</a>. Your use of our Site or Services implies that you accept this Privacy Policy. If you don’t agree with this Privacy Policy, you must not use our Site or Services.</p> <p>As used in this policy, the terms "using" and "processing" information include, but are not limited to, using cookies on a computer, subjecting the information to statistical or other analysis and using or handling information in any way, including, but not limited to collecting, storing, evaluating, modifying, deleting, using, combining, disclosing and transferring information within our organization within the United States.</p> <h4>1. Information Collection and Use</h4> <p>Our primary goals in collecting information are to provide and improve our Site, our Services, features and content, and to enable users to enjoy and easily navigate the Site. You agree that we may use your personal information to:</p> <ul> <li>provide the services and customer support you request;</li> <li>resolve disputes, collect fees, and troubleshoot problems;</li> <li>tell you about our services and those of our corporate family, targeted marketing, service updates, and promotional offers based on your communication preferences;</li> <li>prevent, detect, and investigate potentially prohibited or illegal activities, and enforce our User Agreement;</li> <li>customize, measure and improve our services, content and advertising;</li> <li>to send marketing communications via email (which you may chose not to receive at any time by changing your communications preferences or following the instructions provided with the communication); and</li> <li>to compare information for accuracy, and verify it with third parties.</li> </ul> <p>You can browse our sites without telling us who you are or revealing any personal information about yourself. Once you give us your personal information, you are not anonymous to us. If you use our Site or Services, you consent to the transfer and storage of that information on our servers located in the United States or elsewhere in the world where PetCloud, Inc. may have facilities.</p> <h4>2. Personally Identifiable Information</h4> <p>When you register with us through the Site and become a PetCloud Member, when you choose to post or reserve a listing, or when you contact a PetCloud Member using the “Message” feature of the Site, we will have to collect personally identifiable information.</p> <p>We may collect and store the following personal information:</p> <ul> <li>your name, phone number, email address and home postal address</li> <li>community discussions, chats, dispute resolution, feedback, correspondence through our sites, and correspondence sent to us;</li> <li>transactional information based on your activities on the sites;</li> <li>other information from your interaction with our sites, services, content and advertising, including computer/device and connection information, statistics on page views, traffic to and from the sites, ad data, IP address and standard web log information;</li> <li>billing and other payment information you provide;</li> <li>additional information we ask you to submit to authenticate yourself or if we believe you are violating site policies (for example, we may ask you to send us an ID or bill to verify your address, or to answer additional questions online to help verify your identity or ownership of an item you list);</li> <li>information from other companies, such as demographic and navigation data; and</li> </ul> <p>In order to process some of your transactions through the Site, we may also ask for your credit card number and billing information. We use your Personal Information mainly to provide the Service and administer your inquiries.</p> <p>We use your Personal Information mainly to provide the Service, complete your transactions, and administer your inquiries. We may use your Personal Information (and disclose it to third parties) to verify your identity, derive other information about you, for fraud prevention, to enforce the terms of the <a href="/terms-of-service">Terms of Service</a> and otherwise protect the integrity of our Site or Service, or to verify other information you provided to us or included in your profile, including for example any associations, certifications, or other attributes of your profile. We may also verify your profile information through other means.</p> <p>We also use your Personal Information to contact you with PetCloud newsletters, marketing or promotional materials and other information that may be of interest to you. If you decide at any time that you no longer wish to receive such communications from us, please follow the unsubscribe instructions provided in any of the communications Please note that we may also use your Personal Information to contact you with information related to your use of the Service; you may not opt out of these notifications.</p> <h4>3. Log Data</h4> <p>When you visit the Site, whether as PetCloud Member or a non-registered user just browsing (any of these, a "PetCloud User"), our servers automatically record information that your browser sends whenever you visit a website ("Log Data"). This Log Data may include information such as your computers Internet Protocol ("IP") address, browser type or the webpage you were visiting before you came to our Site, pages of our Site that you visit, the time spent on those pages, information you search for on our Site, access times and dates, and other statistics. We use this information to monitor and analyse use of the Site and the Service and for the Sites technical administration, to increase our Sites functionality and user-friendliness, and to better tailor it to our visitors needs. We also use this information to verify that visitors to the Site meet the criteria required to process their requests.</p> <h4>4. Cookies</h4> <p>Like many websites, we use "cookies" to collect information. A cookie is a small data file that we transfer to your computers hard disk for record-keeping purposes. We use cookies on certain of our pages to help analyse our web page flow; customize our services, content and advertising; measure promotional effectiveness, and promote trust and safety.</p> <p>A few important things you should know about cookies are that:</p> <ul> <li>We offer certain features that are available only through the use of cookies.</li> <li>We use cookies to help identify you and maintain your signed-in status.</li> <li>Most cookies are "session cookies", meaning that they are automatically deleted from your hard drive at the end of a session.</li> <li>You are always free to decline our cookies if your browser permits, although doing so may interfere with your use of some of our sites or services.</li> <li>You may encounter cookies from third parties on certain pages of the sites that we do not control.</li> </ul> <p>PetCloud uses the Google Ad Words remarketing service to advertise on third party websites (including Google) to previous visitors to our site. It could mean that we advertise to previous visitors who haven’t completed a task on our site, for example using the contact form to make an enquiry. This could be in the form of an advertisement on the Google search results page, or a site in the Google Display Network. Third-party vendors, including Google, use cookies to serve ads based on someone’s past visits to the PetCloud website. Of course, any data collected will be used in accordance with our own privacy policy and Google’s privacy policy. You can set preferences for how Google advertises to you using the Google Ad Preferences page, and if you want to you can opt out of interest-based advertising entirely by cookie settings or permanently using a browser plug-in.</p> <h4>5. Web Beacons</h4> <p>Our Web pages may contain electronic images known as Web beacons (sometimes called single-pixel gifs) and are used along with cookies to compile aggregated statistics to analyse how our site is used and may be used in some of our emails to let us know which emails and links have been opened by recipients. This allows us to gauge the effectiveness of our customer communications and marketing campaigns.</p> <h4>6. Messages Sent via a PetCloud account</h4> <p>As part of the Service, PetCloud Users may communicate with PetCloud Members through use of the "Message" feature on the site. Where PetCloud Users have selected the option of adding one or more email addresses to an online form, the message they create in the corresponding template will be sent from PetCloud.com to those email addresses on their behalf. These email addresses will be used only for the purpose of sending the email communication to the addressee.</p> <p>Your use of the “Message” or any other messaging feature of the site constitutes both your acknowledgement that messages sent using these features are not private, and your consent for us to review, save, edit,' +
        'decline to transmit, and otherwise use the messages or their contents or disclose their contents to third parties, in our sole discretion.</p> <h4>7. No Spam, Spyware, Phishing and Spoofing</h4> <p>We and our users do not tolerate spam. Make sure to set your PetCloud communication preferences so we communicate to you as you prefer. You are not licensed to add other PetCloud users to your mailing list (email or physical mail) without their express consent. To report PetCloud-related spam or spoof emails to PetCloud, please <a href="/contact">contact us</a>. You may not use our communication tools to send spam or otherwise send content that would breach our User Agreement. We automatically scan and may manually filter messages to check for spam, viruses, phishing attacks and other malicious activity or illegal or prohibited content, but we do not permanently store messages sent through these tools. If you send an email to an email address that is not registered in our community (via Refer-a-Friend or other tools), we do not permanently store that email or use that email address for any marketing purpose. We do not rent or sell these email addresses.</p> <p>Identity theft and the practice currently known as "phishing" are of great concern to PetCloud. Safeguarding information to help protect you from identity theft is a priority. We do not and will not, at any time, request your credit card information, your account ID, login password, or national identification numbers in a non-secure or unsolicited e-mail or telephone communication.</p> <h4>8. Information Sharing and Disclosure</h4> <p>You grant PetCloud and its users a non-exclusive, royalty-free, transferable, sub licensable, worldwide license to use, store, display, reproduce, modify, create derivative works, perform, and distribute your User Content on PetCloud solely for the purposes of operating, developing, providing, and using the PetCloud Products. Nothing in these Terms shall restrict other legal rights PetCloud may have to User Content, for example under other licenses. We reserve the right to remove or modify User Content for any reason; including User Content that we believe violates these Terms or our policies.</p> <p>We may disclose personal information to, respond to legal requirements, enforce our policies, respond to claims that a listing or other content infringes the rights of others, or protect anyones rights, property, or safety.</p> <p>We may also share your personal information with:</p> <ul> <li>Service providers under contract who help with our business operations (such as fraud investigations, bill collection and rewards programs and customer support).</li> <li>Other PetCloud users, whether located within the US or abroad. For example, where you are involved in a transaction with another user, the other user may view your email address and obtain your contact information and postal address to help complete the transaction.</li> <li>Other third parties to whom you explicitly ask us to send your information (or about whom you are otherwise explicitly notified and consent to when using a specific service).</li> <li>Law enforcement agencies, other governmental agencies or third parties in response to a request for information relating to a criminal investigation, alleged illegal activity or any other activity that may expose us, you or any other PetCloud user to legal liability. The personal information we disclose may include your User ID and User ID history, name, city, county, telephone number, email address, fraud complaints and site activity history or anything else that we deem relevant.</li> <li>Other business entities, should we plan to merge with or be acquired by that business entity. (Should such a combination occur, we will require that the new combined entity follow this privacy policy with respect to your personal information. If your personal information will be used contrary to this policy, you will receive prior notice.)</li> </ul> <p>Without limiting the above, in an effort to respect your privacy and our ability to keep the community free from those who attempt to carry out fraudulent or illegal activities on the site, we will not otherwise disclose your personal information to law enforcement, other government officials, or other third parties without a legally valid request, except when we believe in good faith that the disclosure of information is necessary to prevent imminent physical harm or financial loss or to report suspected illegal activity.</p> <p>If you post any of your information to a public area of our Service, please be aware that it is no longer Personal Information for the purposes of this policy, and we or anyone else may use such information without restriction. If you provide access to Personal Information or other information, including your email address or name, to a limited set of other users through any of our privacy controls or other settings, please understand that PetCloud.com has no control over how others may collect, use, or disclose such information.</p> <h4>9. PetCloud Members and Users</h4> <p>When you register through the Site and submit your Personal Information to create a profile webpage, PetCloud Users will see your first name and last initial ("Required Member Identifiers"). You can choose what other Personal Information you provide as part of your profile ("Other Member Information") (together, your "My Account"). We will display your Profile Information in your profile page, elsewhere on the Site, and on third party sites (e.g., through the use of a PetCloud HTML "widget" or API). Any information you choose to provide as part of your profile should reflect how much you want other PetCloud Users to know about you. We recommend that you guard your anonymity and sensitive information and we encourage members to think carefully about what information about themselves they disclose in their profile pages. You can review and revise your profile information at any time.</p> <p>If you post a listing, we may publish that listing anywhere on the Site and may enable third parties to publish your listing on their site through the use of an HTML "widget". We may also display the geographical location of your listing in the form of a map so that potential guests can see the general area and neighbourhood of your listing. If you enter into a confirmed transaction with another PetCloud Member (that is, you request hosting or sitting from another Member, the other Member confirms your reservation, and your payment is processed, you will have access to that Members Identity Information, and that Member will have access to your Identity Information. Note that Members will never have access to your Billing Information.</p> <p>If you access our sites from a shared computer or a computer in an internet café, certain information about you, such as your user ID or reminders from PetCloud, may also be visible to other individuals who use the computer after you.</p> <h4>10. Service Providers</h4> <p>We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Site-related services (e.g., without limitation, maintenance services, database management, web analytics and improvement of the Sites features) or to assist us in analysing how our Site and Service are used. These third parties may have access to your Personal Information; if they do, this access is only so that they may perform these tasks on our behalf and they are obligated not to disclose or use it for any other purpose. We may also provide Personal Information to our business partners or other trusted entities for the purpose of providing you with information on goods or services we believe will be of interest to you. You can, at any time, opt out of receiving such communications.</p> <h4>11. Compliance with Laws and Law Enforcement</h4> <p>PetCloud cooperates with government and law enforcement officials and private parties to enforce and comply with the law. We will disclose any information about you to government or law enforcement officials or private parties as we, in our sole discretion, believe necessary or appropriate to respond to claims and legal process (including but not limited to subpoenas), to protect the property and rights of PetCloud or a third party, to protect the safety of the public or any person, or to prevent or stop activity we may consider to be, or to pose a risk of being, any illegal, unethical or legally actionable activity.</p> <h4>12. Business Transfers</h4> <p>PetCloud may sell, transfer or otherwise share some or all of its assets, including your Personal Information, in connection with a merger, acquisition, reorganization or sale of assets or in the event of bankruptcy.</p> <h4>13. Accessing, Reviewing and Changing Your Personal Information</h4> <p>All Members may review, update, or correct the Personal Information in their registration profile by contacting us at <a href="mailto:privacy@petcloud.com.au">privacy@petcloud.com.au</a> or editing the relevant part of their profile. If you contact us, we will attempt to accommodate your request, including any request to deactivate your record in our system. In any event, we will comply with applicable law.</p> <h4>14. Security</h4> <p>Your password is the key to your account. Use unique numbers, letters and special characters, and do not disclose your PetCloud password to anyone. If you do share your password or your personal information with others, remember that you are responsible for all actions taken in the name of your account. If you lose control of your password, you may lose substantial control over your personal information and may be subject to legally binding actions taken on your behalf. Therefore, if your password has been compromised for any reason, you should immediately notify PetCloud and change your password.</p> <p>Your information is stored on our servers located in the' +
        'United States or elsewhere in the world where PetCloud, Inc may have facilities. We treat data as an asset that must be protected and use lots of tools (encryption, passwords, etc.) to protect your personal information against unauthorised access and disclosure. However, as you probably know, third parties may unlawfully intercept or access transmissions or private communications, and other users may abuse or misuse your personal information that they collect from the site. No method of transmission over the Internet, or method of electronic storage, is 100% secure, however. Therefore, we cannot guarantee its absolute security. Therefore, although we work very hard to protect your privacy, we do not promise that your personal information or private communications will always remain private.</p> <p>We will attempt to make any legally required disclosures of any breach of the security, confidentiality, or integrity of your unencrypted electronically stored "personal data" (as defined in applicable state statutes on security breach notification) to you via email or conspicuous posting on this Site, insofar as consistent with (i) the legitimate needs of law enforcement or (ii) any measures necessary to determine the scope of the breach and restore the reasonable integrity of the data system.</p> <h4>15. External Site Links</h4> <p>PetCloud may link to Sites created and maintained by public and private organizations which may include or offer third party products or services. When you access a linked site you may be disclosing private information. It is your responsibility to keep such information private and confidential. These third party sites have separate and independent privacy policies. PetCloud does not control or guarantee the accuracy, relevance, timeliness, or completeness of information contained on a linked Site and does not have responsibility or liability for the content and activities of these linked sites. If you click a link to an outside website, you will leave the Site and are subject to the privacy and security policies of the owners/sponsors of the outside website. PetCloud cannot authorise the use of copyrighted materials contained in linked websites. Users must request such authorization from the sponsor of the linked website. PetCloud is not responsible for transmissions users receive from linked websites.</p> <p>PetCloud will not wilfully or intentionally link to any website that exhibits hate, bias, or discrimination. PetCloud reserves the right to deny or remove any link that contains misleading information or unsubstantiated claims, or is determined to be in conflict with PetClouds mission or policies. We seek to protect the integrity of our site at all times and welcome any feedback.</p> <h4>16. Our Policy toward Children</h4> <p>We do not knowingly allow any visitors or users under the age of eighteen (18) to use or otherwise access to the Site. We do not wish to collect any Personal Information (or any information at all) from any persons under 18 years old. If you are under 18 years old, you may not use the Site.</p> <h4>17. International Visitors</h4> <p>The Service is hosted in and provided from the United States. If you use our Service from the European Union or other regions with laws governing data collection and use that may differ from U.S. law, please note that you are transferring your personal data to the United States. The United States does not have the same data protection laws as the EU and some other regions. By providing your personal information, you consent to the transfer of your personal data to the United States and the use of your personal information in accordance with this policy.</p> <h4>18. Consent and Opt Out</h4> <p>By using our site, you consent to our privacy policy. This privacy policy applies to information collected through our Site and not to information collected offline. If there are any questions regarding this policy, or you wish to Opt Out from receiving any messages we may send you, contact us via email, <a href="mailto:privacy@petcloud.com.au">privacy@petcloud.com.au</a>.</p> <h4>19. Changes to Our Privacy Policy</h4> <p>We may revise this Privacy Policy from time to time as we add new features or as laws change that may affect our services. When we make changes to our privacy policy, they are reflected on this page. Any revised Privacy Policy will apply both to information we already have about you at the time of the change, and any personal information created or received after the change takes effect. We encourage you to periodically reread this Privacy Policy, to see if there have been any changes to our policies that may affect you.</p> <h4>20. Contact Information.</h4> <p>If you have any questions or need further information as to the Site or the Services, or need to notify PetCloud as to any matters relating to our Privacy Policy please contact PetCloud at:</p> <p> PetCloud Pty Ltd.<br> 3/28 Metroplex Avenue<br> Murarrie QLD 4172<br> Australia <br> <a href="mailto:privacy@petcloud.com.au">privacy@petcloud.com.au</a> </p> </div> </div> </div>',
    },
  };

  public cmsPage = [
    {
      rspa_property_check: {
        outSideCheck: [
          {
            title: "Security Check",
            message:
              "Entry points to the backyard and front yard areas are securely blocked.",
          },
          {
            title: "Fence is Sturdy",
            message:
              "Is the fence flimsy, poorly constructed or poorly maintained, or inappropriate for containing dogs (such as an electric containment system)?",
          },
          {
            title:
              "Fences are high enough and have no gaps below, through, or above",
            message:
              " Is the fence high enough to prevent the dog escaping? Remember to consider the gate as well as the fence height; the height at the lowest point determines whether or not an animal can jump out",
          },
          {
            title: "No Slopes enable pets to jump over",
            message:
              "Does the slope of the land or adjacent furniture make the fence less secure (facilitating escape either over or under the fence)?",
          },
          {
            title: "No Gaps between fence palings or under",
            message:
              "Are there gaps or holes in the fence that may allow an animal to squeeze through? Dogs can be very determined to squeeze through gaps between palings and spaces in wire mesh. Pay particular attention to gaps under fences.Ensure they are low enough to prevent the dog from escaping under.",
          },
          {
            title: "Gate Bolts or Latches in order",
            message:
              "Do the gates have latches that are easy to use and can keep the gates securely closed?",
          },
          {
            title: "Bodies of Water are fenced",
            message:
              "Are there unfenced water features, such as a pool, fish pond or" +
              "dam? Many pool fences won't exclude a small dog or puppy, and they can drown if they" +
              "accidently fall in and are unable to get out.",
          },
          {
            title: "Moving Cars",
            message:
              "Do cars back out through the dog containment area? If so, how will the dog be kept safe from the moving vehicle?",
          },
          {
            title: "Rocks and Seeds and Poisonous Plants or Litter",
            message:
              " Are there other potential hazards in the" +
              "yard, such as macadamia nuts, palm tree seeds, poisonous plants, or garden rocks?",
          },
          {
            title: "Shade and Shelter",
            message:
              "Is there adequate shade and shelter to protect the animal from the full" +
              "force of the sun throughout the day and/or to escape adverse weather during thunderstorms?" +
              "Remember, shade areas move throughout the day. It is important that shade is available ALL day long.",
          },
          {
            title: "Access to food",
            message:
              "The pets have access to food throughout the day. To avoid ants, the bowl is placed in a shallow tray of water.",
          },

          {
            title: "Cozy Sleeping Spot",
            message: "The pet has access to somewhere comfortable to sleep",
          },
          {
            title: "Toileting area",
            message:
              "The pet has access to the yard or to puppy pads, potty grass, kitty litter.",
          },
          {
            title: "Enrichment Toys",
            message:
              "Pets have access to toys where they have to forage or work to get a treat." +
              "Fresh raw meaty beef or lamb bones plus squeeky and soft comfort toys.",
          },
          {
            title: "Drinking Water",
            message: "The pets have access to a full water bowl all day",
          },
          {
            title: "Escape proof",
            message:
              "You have walked around the entire perimeter of the property to check there are no means of escape.",
          },
        ],
        insideCheck: [
          {
            title: "Security",
            message:
              "entry points to the pet’s area must be securely blocked at all times",
          },
          {
            title: "Cords",
            message:
              "Are there potential hazards indoors, such as electrical cords and curtain cords?",
          },
          {
            title: "Toxic Food",
            message:
              "Toxic food is out of reach such as chocolate, garlic, onion, grapes, sorbitol,macadamia nuts",
          },
          {
            title: "Toxic substances",
            message:
              "Washing powers, cleaning products, and alcohol are out of reach from the pet",
          },
          {
            title: "Latches",
            message:
              "Are latches on the windows/doors secure? Could the cat/kitten dog/puppy potentially wiggle them open?",
          },
          {
            title: "Screens",
            message:
              "Are screens used to create a barrier? If so, screens must be in a good state of repair.",
          },
          {
            title: "Bars",
            message:
              "Are security bars used to create a barrier? If so, the spaces between the bars must be small enough that a cat/kitten dog/puppy cannot squeeze through or become trapped.",
          },
          {
            title: "Windows",
            message:
              "Are there high, relatively inaccessible windows that remain open but may be accessed by a cat via furniture, such as bookshelves?",
          },
          {
            title: "Doors",
            message:
              "Are there certain doors that must remain closed to keep the cat/kitten dog/puppy" +
              "secure? Will children or other family members remember and reliably stick to these rules?" +
              "Everyday household items - Are there normal household items that may become a hazard for" +
              "playful pets, particularly if they are bored? Sharp objects, candles, and fish tanks are obvious hazards.",
          },
          {
            title: "Ventilation",
            message:
              "If the house is relying on doors and windows to be closed to keep the cat/kitten dog/puppy secure, will the room be too hot/stuffy in summer?",
          },
          {
            title: "Access to food",
            message:
              "The pets have access to food throughout the day. To avoid ants, the bowl is placed in a shallow tray of water.",
          },

          {
            title: "Cozy Sleeping Spot",
            message: "The pet has access to somewhere comfortable to sleep",
          },
          {
            title: "Toileting area",
            message:
              "Entry points to the backyard and front yard areas are securely blocked.",
          },
          {
            title: "Enrichment Toys",
            message:
              "Pets have access to toys where they have to forage or work to get a treat. Fresh raw meaty beef or lamb bones plus squeeky and soft comfort toys",
          },
          {
            title: "Drinking Water",
            message: "The pets have access to a full water bowl all day",
          },
          {
            title: "Clean and Hygienic",
            message:
              "the overall standard of hygiene and cleanliness at the property, including" +
              "the disposal of waste materials; to a level that is appropriate to accommodate humans and pets.",
          },
        ],
        questions: [
          {
            title: "What previous experience have you had in minding pets?",
          },
          {
            title:
              "What dog breeds and types of pets do you have experience in minding?",
          },
          {
            title:
              "Will there be other pets or children will be present when the pet stay takes place?",
          },
          {
            title:
              "How often will you be home with my pet? Do you have other full time work commitments? Are you home on weekends?",
          },
          {
            title: "Do you have references or reviews?",
          },
          {
            title: "Why do you like being a Pet Sitter?",
          },
          {
            title:
              "Are you insured? (with PetCloud every Sitter is insured, as we pay for all our Sitters nationally to be insured)",
          },
          {
            title:
              "How often do you answer your phone if I need to contact you?",
          },
          {
            title:
              "Where will you be taking my dog for a walk during the stay? Are there parks or beaches?",
          },
          {
            title:
              "What do you normally do in the event of a Veterinary emergency?",
          },
          {
            title:
              "What would you do if my pet escaped in order to recover them?",
          },
          {
            title:
              "How far away is your nearest Vet located and are they 24hrs?",
          },
          {
            title:
              "Do you have a car and license in event of emergency or trips to the groomers?",
          },
        ],
        observations: [
          {
            title: "Observation",
            message:
              "Watch your pet’s interaction with the Sitter and or their pets. Do they seem to get" +
              "along? Get your pet sitter to take your pet for a short walk and say a few basic commands like ‘sit’," +
              "‘stay’, ‘leave it’, ‘lie down’ and do they come when the sitter calls their name? You are trying to " +
              "assess whether they handle/control your pet when out in public situations.",
          },
        ],
      },
      preparation: [
        {
          title: "Pet's full profile is complete including emergency contacts",
          message:
            "Make sure you complete your Pet's full profile (which includes their Emergency contact person)",
          message2:
            "Before your Pet's stay begins, make sure you complete your Pet's full profile. Your chosen Sitter will need to know your Pet's Emergency Contact person while you're away, whether your pet is desexed, & what they eat. This is a time set up only",
        },

        {
          title: "Pet's full profile is complete including emergency contacts",
          message:
            "Make sure you complete your Pet's full profile (which includes their Emergency contact person)",
          message2:
            "Before your Pet's stay begins, make sure you complete your Pet's full profile. Your chosen Sitter will need to know your Pet's Emergency Contact person while you're away, whether your pet is desexed, & what they eat. This is a time set up only",
        },

        {
          title: "Dog Owners: Teach your dog basic commands & socialise them",
          message1:
            "Be sure your dog responds to basic commands and is well socialised around both other people and pets; if your dog has an aggression problem or is otherwise unruly, he/she may not be a good candidate for pet sitting. If you engage with a Trainer, ensure you ask them if they use only use “positive reinforcement” only - this is a trainer that rewards a pet for good behaviour and not one that yells or hurts them or uses choker collars.",
          message2: "",
        },

        {
          title: "Take them to the Vet to get Up-to-date vaccinations",
          message1:
            "Ensure your dog is up-to-date on vaccinations before taking them to the Pet Sitters home to stay. It is a measure of a quality service if companies do ask for vaccination proof as it guarantees your pet stays in a hygienic environment.",
          message2: "",
        },

        {
          title: "Apply Flea and tick control",
          message1:
            "Ensure your dog is de-flead & up-to-date on flea control treatments. Fleas can be prevented easily and effectively with a once a month topical solution or tablet.",
          message2: "",
        },

        {
          title: "Give Heart and Gut Worming",
          message1:
            "Ensure your dog is up-to-date on HeartWorm + Gut Worming (Gut / Intestinal Wormers are known as 'All wormers' but do not include Heartworm)",
          message2:
            "Ensure your dog is up-to-date on Heart Worm and also Intestinal Worming (this can be x2 different monthly tablet types purchased from Vets or supermarkets or Pet Stores)",
        },

        {
          title: "Give Heart and Gut Worming",
          message1:
            "Ensure your dog is up-to-date on HeartWorm + Gut Worming (Gut / Intestinal Wormers are known as 'All wormers' but do not include Heartworm)",
          message2:
            "Ensure your dog is up-to-date on Heart Worm and also Intestinal Worming (this can be x2 different monthly tablet types purchased from Vets or supermarkets or Pet Stores)",
        },

        {
          title:
            "Take your Pet to the Vet to have them Desexed or select a Sitter whose pets are desexed",
          message1:
            "Ensure that either your pet is desexed or you have selected a Sitter whose" +
            "pets are desexed - you want to avoid returning home to a pregnant pet. Don't" +
            "forget to add this to your pet's PetCloud profile. Sitters are not responsible if" +
            "your pet is impregnated",

          message2: "",
        },
        {
          title: "Microchip your Pet",
          message1:
            "Ensure your Pet is microchipped this can be done at the Vet. This makes" +
            "contacting you faster if you pet escapes and end up at the pound or vet",
          message2: "",
        },
        {
          title: "Add an Engraved ID Tag to their collar",
          message1:
            "You can purchase aluminum or stainless steel ID Tags and get engraving done at any local shopping centre’s Key cutting and Shoe repair store.",
          message2:
            "This should have ● Your Pet’s name ● Your mobile phone number",
        },
        {
          title: "Add your pet’s Council Registration Tag to their collar",
          message2:
            "When you register your dog for a council permit, you will be sent a plastic" +
            "council registration tag with a number on it in the mail which you attach to" +
            "your dog’s collar. Cats aren't always required to be registered with councils" +
            "so double check what your local council requires by Googling it online.",
        },

        {
          title: "Shop for your pet’s food",
          message2:
            "Shop for enough wet and dry food for your Pet and meaty bones to last the pet stay (+ 2 extra days)",
        },

        {
          title: "Shop for toileting products",
          message2:
            "Puppy Pads, Poop bags, Poop Bag Dispensers or Kitty litter trays and kitty litter",
        },

        {
          title: "Full body checks inc teeth and gums",
          message2:
            "Full body checks, including teeth and gums, paws and claws to ensure any early veterinary-related issues are identified and dealt with before the stay begins.",
        },
      ],
      packingList: [
        {
          title: "Disposable Puppy Pads or Cat litter tray with litter",
        },
        {
          title: "A roll of poo bags and a poo bag dispenser",
        },
        {
          title:
            "A lead / leash - (Make sure they are wearing a collar with an on it and a Council Registration tag)",
        },
        {
          title:
            "Engraved ID Tag with your current address and contact numbers.",
        },
        {
          title: "Grooming Brush, Nail Clippers, Flea Shampoo",
        },
        {
          title:
            "Any medication they are on ie. antibiotics, insulin, anxiety chews, tablets",
        },
        {
          title: "Flea and tick control + heartworm + stomach (allwormer)",
        },
        {
          title:
            "Enough Dry Food & Wet Food for the Stay + 2 days extra just in case",
        },
        {
          title: "Enrichment toys such as a smart treat ball",
        },
        {
          title:
            "Dog Yoghurt Drops, Pigs Ears, Chicken dried tenderloins, or Dried Liver Treats",
        },
        {
          title:
            "A soft plush comfort toy, a squeaky toy they can chew or fetch",
        },
        {
          title: "A collapsible silicone bowl or canvas foldable bowl",
        },
        {
          title: "A soft bed",
        },
        {
          title: "A car harness or booster box with harness",
        },
      ],
      houseSitting: [
        {
          madeSure: [
            {
              value: false,
              title:
                "Your bed has fresh sheets, blankets and pillows and house is smelling fresh",
            },
            {
              value: false,
              title: "That all locks are secure and work.",
            },
            {
              value: false,
              title:
                "Made neighbours aware that you will be staying/doing house visits",
            },
            {
              value: false,
              title:
                "I have completed my Pet’s full profile on PetCloud, including Emergency Vet contact details, and my authorised Vet Spend limit.",
            },
          ],
          access: [
            {
              title: "House Alarm Pin is:",
              placeholder: "Pin No",
              value: "",
              type: "text",
              placeholder1: "",
              radioBt: false,
            },
            {
              title: "Security Company Name and Phone number is:",
              type: "text",
              placeholder: "Provide company name",
              value: "",
              placeholder1: "Provide phone name",
              value2: "",
              type2: "number",
              radioBt: false,
            },
            {
              title: "The house keys and garage remote can be found:",
              placeholder: "Provide provide information",
              value: "",
              placeholder1: "",
              radioBt: false,
            },
            {
              title: "Security Cameras exist: yes/no",
              radioBtn: [
                { name: "Yes", value: false },
                { name: "No", value: false },
              ],
              placeholder1: "",
              placeholder: "",
              radioBt: true,
            },
          ],
          request: [
            {
              value: false,
              title: "Daily top up my pet’s water/food",
            },
            {
              value: false,
              title: "Pick up dog mess from the yard",
            },
            {
              value: false,
              title: "Bring in the mail",
            },
            {
              value: false,
              title: "Put the bins out for collection on",
            },

            {
              value: false,
              title: "Water indoor/outdoor plants every",
            },
            {
              value: false,
              title:
                "Draw the curtains and turn lamps on every evening to make house look lived in",
            },
          ],
          welcomeTo: [
            {
              title: "Use the WiFi. The Username is: Password:",
              placeholder1: "Enter User Name ",
              placeholder2: "Enter Password",
              value: "",
              value1: "",
            },
            {
              title: "Use the TV/Cable TV Main buttons to press on remote/s:",
              placeholder1: "Please provide information",
              value: "",
              placeholder2: "",
            },
            {
              title: "Use the washing machine",
              placeholder1: "Please provide information",
              value: "",
              placeholder2: "",
            },
            {
              title: "Use the dishwasher",
              placeholder1: "Please provide information",
              value: "",
              placeholder2: "",
            },

            {
              title: "Eat food left in fridge.",
              placeholder1: "Please provide information",
              value: "",
              placeholder2: "",
            },
            {
              title: "Tea/coffee left in the cupboard",
              placeholder1: "Please provide information",
              value: "",
              placeholder2: "",
            },
          ],
          BeforeYouGo: [
            {
              title: "Activate House Alarm:",
              checkbox: [{ value: false }],
              isCb: true,
            },
            {
              title: "Leave the keys and remote in the same spot",
              checkbox: [{ value: false }],
              isCb: true,
            },
            {
              title: "Strip the bed and wash and hang sheets to dry",
              checkbox: [{ value: false }],
              isCb: true,
            },
            {
              title: "Wipe the benches and give the floors a mop/a vacuum",
              additional: "Cleaning products are located:",
              checkbox: [{ value: "false" }],
              placeHolder: "Enter cleaning product location",
              value: "",
              placeHolder1: "Enter Mop location",
              value1: "",
              placeHolder2: "Enter vaccuum location",
              value2: "",
              additional1: "Mop is located:",
              additional2: "Vacuum is located:",
              isCb: true,
            },
            {
              title: "Empty the indoor bins",
              checkbox: [{ value: "false" }],
              isCb: true,
            },
            {
              title: "Lock all the doors and gates",
              checkbox: [{ value: "false" }],
              isCb: true,
            },
            {
              title:
                "A contact name and number of a key person not on holidays with me is:",
              placeHolder: "Contact Name",
              value: "",
              placeHolder1: "Mobile Number",
              value2: "",
              isCb: false,
            },
            {
              title: "Handyman:",
              additional: "https://hireahubby.com.au/",
              additional1: " https://www.homeimprovementpages.com.au/",
              additional2: "http://www.jimsbuildingmaintenance.com.au/",
              isCb: false,
              placeHolder: "",
              placeHolder1: "",
              placeHolder2: "",
            },
          ],
          specialRequirement: [
            {
              title: "Swimming Pool:",
              title2: "Pool maintenance contact:",
              placeholder1: "",
              placeholder2: "Pool Maintenace Conact Number",
              type: "number",
              value: "",
            },
            {
              title: "Water Garden System:",
              title2: "",
              placeholder1: "Please provide Information",
              placeholder2: "",
              type: "text",
              value: "",
            },
            {
              title: "Pond Water System:",
              title2: "",
              placeholder1: "Please provide information",
              placeholder2: "",
              type: "text",
              value: "",
            },
            {
              title: "Hot Water System:",
              title2: "Plumber Contact:",
              placeholder1: "",
              placeholder2: "Plumber contact number",
              type: "number",
              value: "",
            },
            {
              title: "Solar Power System:",
              title2: "Electrician contact:",
              placeholder1: "",
              placeholder2: "Plumber electrician number",
              type: "number",
              value: "",
            },
            {
              title: "Lawn Sprinkler System:",
              title2: "",
              placeholder1: "",
              placeholder2: "Please provide information",
              type: "text",
              value: "",
            },
            {
              title: "Gas System:",
              title2: "Gas Company contact:",
              placeholder1: "",
              placeholder2: "Gas company contact number",
              type: "number",
              value: "",
            },
          ],
        },
      ],
    },

    {
      helpArticles: {
        helpArticle: [
          {
            title: "*** Accident or Illness ***",
            content:
              "Sometimes during a pet stay, emergencies will arise. It is important to remain calm, but act quickly. If a pet becomes ill or gets injured, the pet sitter ...",
            dateTime: "Thu, 11 Oct, 2018 at 5:25 PM",
            redirectTo:
              "https://community.petcloud.com.au/portal/en/kb/articles/accident-or-illness",
          },
          {
            title: "What to do if a Pet Escapes during a Stay",
            content:
              "In case a pet escapes, the pet sitter should: Inform the pet owner and/or their emergency contact about what has happened and have good communication with...",
            dateTime: "Thu, 11 Oct, 2018 at 5:22 PM",
            redirectTo:
              "https://community.petcloud.com.au/portal/en/kb/articles/what-to-do-if-a-pet-escapes-during-a-stay",
          },
          {
            title: "Non-Life Threatening Pet Medical Issues",
            content:
              "For non-life threatening Vet issues, we recommend the use of phone or video using skype or facebook.  You can try iVet if you are in Darwin or VetChat if y...",
            dateTime: "Sun, 29 Dec, 2019 at 5:58 PM",
            redirectTo:
              "https://community.petcloud.com.au/portal/en/kb/articles/non-life-threatening-pet-medical-issues",
          },
          {
            title: "How to transport an injured pet",
            content:
              "Transporting an injured dog After identifying an injury or illness, the next step is to safely transport your dog to the nearest veterinarian. Improper tec...",
            dateTime: "Mon, 20 Nov, 2017 at 5:59 PM",
            redirectTo:
              "https://community.petcloud.com.au/portal/en/kb/articles/how-to-transport-an-injured-pet",
          },
          {
            title: "How to give CPR to a Pet",
            content:
              "Always lay them on their right hand side. See procedures from the AEC website here: http://www.aecvets.com.au/docs/Updated%20Info%20Sheets/CPR-for-your-...",
            dateTime: "Fri, 11 Aug, 2017 at 5:11 AM",
            redirectTo:
              "https://community.petcloud.com.au/portal/en/kb/articles/how-to-give-cpr-to-a-pet",
          },
          {
            title: "Bloat - Emergency",
            content:
              "Bloat is a condition in which the stomach becomes painfully distended by gas or food, and is known as gastric dilation. The bloated stomach has a tendenc...",
            dateTime: "Fri, 11 Aug, 2017 at 5:42 AM",
            redirectTo:
              "https://community.petcloud.com.au/portal/en/kb/articles/bloat-emergency",
          },

          {
            title: "Urinary tract blockages in Cats - Emergency",
            content:
              "http://www.aecvets.com.au/docs/Updated%20Info%20Sheets/FLUTD-2016.pdf",
            dateTime: "Fri, 11 Aug, 2017 at 5:44 AM",
            redirectTo:
              "https://community.petcloud.com.au/portal/en/kb/articles/urinary-tract-blockages-in-cats-emergency",
          },
          {
            title: "A dog has developed Hot Spots during a stay",
            content:
              "“Hot spots” are a common type of skin irritation in dogs and tend to be more prevalent in the warmer months The underlying cause is often difficult to i...",
            dateTime: "Fri, 15 Sep, 2017 at 12:42 AM",
            redirectTo:
              "https://community.petcloud.com.au/portal/en/kb/articles/a-dog-has-developed-hot-spots-during-a-stay",
          },
        ],
      },
    },
  ];

}
