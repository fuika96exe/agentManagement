// js/templates.js

// 确保 window.app 存在，防止报错
window.app = window.app || {};

/**
 * 生成完整版租赁合同 HTML
 * 该函数接收一个 data 对象，返回一个包含完整 16 页合同的 HTML 字符串。
 */
window.app.generateTenancyAgreementHTML = function(data) {
    
    // --- 1. 数据格式化工具 ---
    
    // 格式化日期 (例: 01 October 2025)
    const formatDate = (dateStr) => {
        if (!dateStr) return '<span style="color:red">[MISSING DATE]</span>';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    // 格式化金额 (例: 2,500.00)
    const formatMoney = (val) => {
        return val ? parseFloat(val).toLocaleString('en-MY', {minimumFractionDigits: 2}) : '0.00';
    };

    // --- 2. 准备数据 ---
    const prop = data.property || {};
    const owner = data.owner || {};
    const tenant = data.tenant || {};
    
    // 自动计算押金 (如果数据库没存，就按标准算：2个月押金 + 0.5个月水电)
    const monthlyRent = parseFloat(tenant.monthlyRent || 0);
    const securityDep = monthlyRent * 2;
    const utilityDep = monthlyRent * 0.5;

    // --- 3. 返回完整的 HTML 模板 ---
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Tenancy Agreement - ${prop.name}</title>
        <style>
            /* === 打印专用样式 === */
            @media print {
                @page { size: A4; margin: 2.54cm; } /* 标准 A4 边距 */
                body { -webkit-print-color-adjust: exact; }
                .page-break { page-break-after: always; } /* 强制分页 */
            }

            /* === 全局排版 === */
            body {
                font-family: 'Times New Roman', Times, serif; /* 法律文件标准字体 */
                font-size: 11pt;
                line-height: 1.4;
                text-align: justify; /* 两端对齐 */
                color: #000;
                background: #fff;
                margin: 0;
                padding: 20px;
            }
            
            p { margin-bottom: 1em; }
            strong { font-weight: bold; }
            .text-center { text-align: center; }
            .uppercase { text-transform: uppercase; }
            
            /* 封面标题 */
            .cover-title {
                font-size: 24pt;
                font-weight: bold;
                text-decoration: underline;
                text-align: center;
                margin-top: 150px;
                margin-bottom: 60px;
            }
            
            /* 列表样式 */
            ul { list-style-type: none; padding-left: 20px; }
            li { margin-bottom: 8px; }

            /* 签名区 */
            .signature-table { width: 100%; margin-top: 50px; }
            .signature-table td { width: 50%; vertical-align: top; padding: 20px; }
            .sign-line { border-top: 1px solid #000; width: 90%; margin-top: 50px; margin-bottom: 5px; }

            /* 附表样式 (The Schedule) */
            .schedule-title { text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 5px; }
            table.schedule { width: 100%; border-collapse: collapse; margin-top: 20px; }
            table.schedule td { border: 1px solid #000; padding: 8px; vertical-align: top; }
            .col-part { width: 10%; font-weight: bold; text-align: center; }
            .col-desc { width: 35%; font-weight: bold; }
            .col-val { width: 55%; }
        </style>
    </head>
    <body>

        <div class="page-break">
            <div class="cover-title">TENANCY AGREEMENT</div>
            
            <div class="text-center" style="margin-bottom: 40px;">BETWEEN</div>

            <div class="text-center" style="margin-bottom: 40px;">
                <strong>${owner.fullName || 'LANDLORD NAME'}</strong><br>
                (NRIC: ${owner.icPassport || '_________________'})<br>
                <br>
                (Hereinafter referred to as "The Landlord")
            </div>

            <div class="text-center" style="margin-bottom: 40px;">AND</div>

            <div class="text-center" style="margin-bottom: 40px;">
                <strong>${tenant.fullName || 'TENANT NAME'}</strong><br>
                (NRIC/Passport: ${tenant.icPassport || '_________________'})<br>
                <br>
                (Hereinafter referred to as "The Tenant")
            </div>

            <br><br><br>
            <div class="text-center">
                <strong>PROPERTY ADDRESS:</strong><br>
                <span class="uppercase">${prop.address || 'Address Line 1'}, ${prop.city || ''}, ${prop.state || ''} ${prop.postalCode || ''}</span>
            </div>
        </div>

        <div class="page-break">
            <h3 class="text-center">TENANCY AGREEMENT</h3>
            
            <p><strong>THIS AGREEMENT</strong> is made the day and year as stated in <strong>Part 1 of the First Schedule</strong> annexed hereto.</p>
            <p><strong>BETWEEN</strong> the party whose name and address are stated in <strong>Part 2 of the First Schedule</strong> (hereinafter referred to as "the Landlord") of the one part;</p>
            <p><strong>AND</strong> the party whose name and address are stated in <strong>Part 3 of the First Schedule</strong> (hereinafter referred to as "the Tenant") of the other part.</p>
            <p><strong>WHEREAS</strong> the Landlord is desirous of letting and the Tenant is desirous of accepting a tenancy of all that parcel of premises more particularly referred to and described in <strong>Part 4 of the First Schedule</strong> (hereinafter referred to as "the Demised Premises") upon the terms and subject to the conditions hereinafter appearing.</p>

            <p><strong>NOW IT IS HEREBY AGREED AS FOLLOWS:-</strong></p>

            <p><strong>1. AGREEMENT FOR TENANCY</strong><br>
            In consideration of the Tenant paying to the Landlord the rent hereby reserved and performing and observing the Tenant's covenants, undertakings, obligations, stipulations and agreements herein contained, the Landlord hereby lets and the Tenant hereby takes a tenancy of the Demised Premises for a term as stipulated in <strong>Part 5(A) of the First Schedule</strong>, commencing and expiring on the respective dates stated in <strong>Part 6 and Part 7</strong> thereof at the rental stipulated in <strong>Part 8 of the First Schedule</strong>, all such rentals to be payable monthly in advance by the Tenant to the Landlord's bank account details stipulated in <strong>Part 8 of the First Schedule</strong> and the first of such payment of rentals shall be made upon the commencement of the term hereby created or upon the execution of this Agreement, whichever is the earlier, and the subsequent payment of rentals to be made on the 7th day of each and every succeeding calendar month, whether formally demanded or not.</p>

            <p><strong>2. DEPOSITS</strong></p>
            <p><strong>2.1 (a)</strong> The Tenant shall upon the commencement of the term hereby created or upon the execution of this Agreement, whichever is the earlier, pay to the Landlord the sum stipulated in <strong>Part 9 of the First Schedule</strong> by way of rental deposit as security for the due observance and performance by the Tenant of the covenants, undertakings, stipulations, obligations and agreements on his part herein contained (hereinafter referred to as "the Rental Deposit"), which said Rental Deposit shall be maintained at the aforesaid figure throughout the tenancy hereby created and without obligation on the Landlord to invest the same and shall not without the prior written consent of the Landlord be deemed to be or treated as payment of or towards the rentals or any part thereof covenanted to be paid by the Tenant.</p>
            <p><strong>2.1 (b)</strong> Upon the expiration or sooner determination of the tenancy hereby created or any renewal thereof, the Rental Deposit shall be refunded to the Tenant free of interest less such sum(s) as may be found due to the Landlord as hereinafter provided (of which the Landlord shall be entitled at his option from time to time or at any time either during or after the expiration or sooner determination of this tenancy or any renewal thereof appropriate from the whole or any part of the Rental Deposit) but nothing herein contained shall be deemed to restrict or prejudice any other rights or remedies of the Landlord to claim any balance sum for which the Tenant may be liable under this tenancy.</p>
            <p><strong>2.2 (a)</strong> The Tenant shall pay to the Landlord upon the execution of this Agreement or upon the commencement of the term hereby created or any renewal thereof, whichever is the earlier, a further sum as stated in <strong>Part 10 of the First Schedule</strong> by way of deposit for the supply of water and electricity in respect of the Demised Premises (hereinafter referred to as "Utilities Deposit") which said Utilities Deposit shall be refunded to the Tenant free of interest at the expiration or sooner determination of the tenancy hereby created or any renewal thereof less such sum(s) as may then be found to be due to the Landlord.</p>
            <p><strong>2.2 (b)</strong> Notwithstanding paragraph (a) above, the Landlord shall be entitled at any time during the currency of the tenancy of the Demised Premises increase the Utilities Deposit in such amount as the Landlord shall deem necessary in the event that the same is insufficient to cover the consumption of water and electricity by the Tenant and the charges for the Indah Water Konsortium in respect of the Demised Premises.</p>

            <p><strong>3. TENANT'S COVENANTS</strong><br>The Tenant hereby covenants and undertakes with the Landlord as follows:-</p>
            <p>(a) To promptly pay the rent hereby reserved on the days and in the manner as aforesaid;</p>
            <p>(b) At all times to promptly pay and discharge all existing and future charges for the supply of water, electricity, gas and Indah Water Konsortium in respect of the Demised Premises, including any deposits required in connection with such supply;</p>
            <p>(c) In the event that the Tenant should require a telephone and/or facsimile line and/or the use of the Astro decoder and services at the Demised Premises, the Tenant himself shall have to apply for the said facilities from the appropriate authorities at his own cost and expense and shall at all times promptly pay and discharge all charges and subscription fees payable for the supply of the telephone, facsimile and/or Astro services at the Demised Premises and all other charges related thereto or arising therefrom. The Tenant undertakes at his own costs and expense to disconnect the accounts of the telephone, facsimile and/or Astro and pay and settle all arrears of the charges thereby incurred upon such disconnection on the determination of the tenancy hereby created;</p>
            <p>(d) At all times to keep and maintain the walls, ceilings, floors, the interior and exterior of the Demised Premises, doors, shutters, locks, fastenings, glass in the windows and any other fixtures and fittings therein, the sanitary electrical and water apparatus thereof (other than the main structure of the Demised Premises) in good and tenantable repair and condition (fair wear and tear and damage by storm, lightning, flood, tempest, Acts of God, riot and civil commotion only excepted);</p>
            <p>(e) Not to permit or suffer any lavatories in the Demised Premises to be used in an improper way or such manner whereby the soil or water pipes may become impeded or blocked;</p>
            <p>(f) Upon prior notice in writing having been given by the Landlord to the Tenant, to permit the Landlord, his servants and/or agents with or without workmen and with or without appliance at all reasonable times to enter and view the condition of the Demised Premises and where necessary, the Landlord may give a written notice to the Tenant to execute any repairs alterations improvements or works that the Landlord may think fit to the Demised Premises or any part thereof and for which the Tenant is liable hereunder. The Tenant shall forthwith repair make good replace and mend in a proper and workmanlike manner any such defects or damages to the Demised Premises and if the Tenant shall not within fourteen (14) days after service of the written notice by the Landlord proceed diligently with the execution of such repairs, alterations, improvements or works, the Landlord, his servants and/or agents with or without workmen and with or without appliance shall be entitled (but not obliged) to enter and the Tenant shall permit them to enter upon the Demised Premises and to execute such repairs, alterations, improvements or works and the costs and expenses thereof shall be a debt immediately due from the Tenant to the Landlord and shall forthwith be recoverable by legal action;</p>
            <p>(g) Upon prior notice in writing having been given by the Landlord to the Tenant, to permit the Landlord, his servants and/or agents with or without workmen and with or without appliance at all reasonable times to enter upon the Demised Premises and to carry out any repairs, alterations or works, including laying, fixing in or leading through in over under or upon the Demised Premises or any part thereof any wires cables and ducts for telephone, electricity and air-conditioning installation and pipes for water gas waste or sewage, that the Landlord may in his absolute discretion deem necessary or which is required by the appropriate authorities;</p>
            <p>(h) Not to make or permit or suffer to make any alterations or renovations to the Demised Premises nor to remove or permit to remove any fixtures and fittings from the Demised Premises (whether such fixtures and fittings be the property of the Tenant or any other person) without the prior written consent of the Landlord. If such consent is given by the Landlord, the Tenant undertakes to make or cause the said alterations or renovations to be made in conformity with such plans and specifications (the sufficiency of which the Landlord shall not be responsible for) as shall be approved in written form by the Landlord and all appropriate authorities and upon such other terms and conditions as the Landlord may in their absolute discretion deem necessary at the Tenant's own costs and expenses. Provided Always that the Landlord shall not be liable to reimburse the Tenant for the costs and expenses incurred by the Tenant for any improvements made to the Demised Premises nor shall the Tenant be entitled to claim for any reduction in the rent hereby reserved on account of such costs and expenses. Provided Further that the Tenant shall indemnify and keep the Landlord fully indemnified against any restoration of the Demised Premises to its original position if required by the relevant authorities;</p>
            <p>(i) Not to install any electrical socket, plug or electrical power points or appliance or air-conditioning unit which installation may overload and cause damage to the electricity supply or to any of the existing electrical installations in the Demised Premises;</p>
            <p>(j) At all times during the currency of this tenancy, to use the Demised Premises only for such purpose as specified in <strong>Part 12 of the First Schedule</strong> throughout the tenancy herein and:-</p>
            <ul>
                <li>not to use the Demised Premises as a laboratory or workshop or as a warehouse store;</li>
                <li>not to carry on or permit or suffer to be carried on in the Demised Premises any immoral or illegal activities or any vocation which may cause inconvenience or nuisance to the general public or the neighbouring occupiers;</li>
                <li>not to permit or suffer anyone to sleep in the Demised Premises or use or permit or suffer the use of the same wholly or partly for dwelling;</li>
                <li>not to carry on or permit or suffer to be carried on in the Demised Premises any business or activity which emit, accumulate and disseminate any unpleasant odour or dirt;</li>
                <li>not to carry on or permit or suffer to be carried on the Demised Premises any business or activity which create any disturbances and the Tenant covenants to control the sound or noise level (if any) created therefrom to the extent acceptable to the general public, the neighbouring occupiers and the relevant authorities;</li>
                <li>not to carry on or permit or suffer to be carried on the Demised Premises any business or activity dealing with substances and chemicals of an explosive and dangerous character and their by-products;</li>
                <li>not to carry on or permit or suffer to be carried on the Demised Premises any business or activity for public entertainment or amusement or which involves gambling in any form;</li>
                <li>not to use or permit or suffer the use of the Demised Premises as a place for public or private auction;</li>
                <li>not to use or permit or suffer the use of the Demised Premises as a massage parlour, funeral parlour or death house and any kinds of business or activity related thereto;</li>
                <li>not to carry on or permit or suffer to be carried on the Demised Premises any business or activity which infringes or violates the trademarks, copyrights, patents or any other intellectual proprietary rights of any third party or parties; and</li>
                <li>Not to do or permit to be done on the Demised Premises anything which will or may infringe any of the laws, by-laws, regulations or orders made by the Government, the City/Municipal Hall or any other competent authority affecting the Demised Premises</li>
            </ul>
            <p>(k) Not to bring or store or permit or suffer to be brought or stored on the Demised Premises or any part thereof arms, ammunition or unlawful goods, gunpowder, saltpetre or any combustible substance or refuse dump or any goods which in the opinion of the Landlord are of a noxious or dangerous or hazardous nature;</p>
            <p>(l) Not to store or bring upon the Demised Premises any articles of a specially combustible inflammable or dangerous nature and not to do or to permit or suffer anything by reason whereof any insurance policy effected on the Demised Premises may be rendered void and voidable or whereby the rate of premium thereon may be increased and to comply with all recommendations of the insurers and fire authorities as to fire precautions relating to the Demised Premises. The Tenant shall repay to the Landlord all sums paid by way of increased premiums and all expenses incurred by the Landlord in or about the renewal of any insurance policy rendered necessary by a breach of this covenant but nothing herein contained shall be deemed to restrict or prejudice any other rights or remedies which the Landlord may have against the Tenant in respect thereof;</p>
            <p>(m) Not to place or expose for sale exhibition or otherwise permit or suffer to be placed or exposed upon or over the ground or space outside the front of the Demised Premises any goods materials or things whatsoever and shall not cause or permit or suffer to be caused any obstruction to the entrance foot-paths passages or roadways leading to the Demised Premises,</p>
            <p>(n) Not to affix any sign plates or boards on the outside or the facade of the Demised Premises save with the prior written consent of the Landlord which may be given subject to such terms and conditions as the Landlord may in his absolute discretion deem fit;</p>
            <p>(o) Upon the receipt of any notice order direction or other instructions from any appropriate authorities affecting or likely to affect the Demised Premises, to forthwith deliver to the Landlord a copy of such notice order direction or other instruction and if applicable, to promptly comply with the said notice order direction or instruction at the Tenant's own costs and expenses;</p>
            <p>(p) Not to do or omit to do or permit or suffer or omit to be done any act matter or thing in or on or respecting the Demised Premises which shall or may likely contravene the provisions of any laws, bye-laws, rules and regulations affecting the Demised Premises which are now in force or which may hereafter be enacted;</p>
            <p>(q) Not to assign this tenancy or underlet or sublet or part with the possession or the occupation or the use of the Demised Premises or any part thereof without the prior written consent of the Landlord. In the event of the Tenant assigning, underletting, subletting or parting with the actual or legal possession or use of the Demised Premises or any part thereof in breach of this covenant, then the Tenant shall indemnify and keep the Landlord fully indemnified against all claims, demands, actions, proceedings, damages, losses, costs and expenses whatsoever made or taken by such person(s) against the Landlord or suffered or incurred by the Landlord in respect thereof;</p>
            <p>(r) At any time during the two (2) months immediately preceding the expiration or determination of the term hereby created or any renewal thereof, to permit intending tenant(s) and others with written authority from the Landlord, his servants and/or agents at all reasonable times of the day and after giving prior written notice thereof, to enter and view the Demised Premises or any part thereof;</p>
            <p>(s) To permit the Landlord at any time during the two (2) months period immediately preceding the expiration or determination of the term hereby created or any renewal thereof to affix display or otherwise exhibit without interference or obstruction upon and/or outside any part of the Demised Premises a notice or advertisement indicating that the Demised Premises is available for rent together with such other relevant information in respect thereto;</p>
            <p>(t) At all times to indemnify and keep the Landlord fully indemnified against all actions, proceedings, claims, demands, writs, summons, suits, fines, judgements, orders, decrees, damages, penalties, damages, losses, costs and expenses whatsoever which may be taken, made or imposed against or suffered or incurred by the Landlord in connection with loss of life, personal injury and/or damage to property arising from or out of any occurrences in, upon or at the Demised Premises or any part thereof by reason of any act or omission or any breach by the Tenant of any of the covenants, undertakings, obligations stipulations or agreements on his part herein contained and/or by reason of the act default neglect error or omission of the Tenant, his servants, agents, licensees, invitees or visitors of the Tenant or by any of the Tenant's employees, independent contractors, agents, invitees or licensees and which act or omission shall give rise to any cause of action against the Landlord as proprietor of the Demised Premises;</p>
            <p>(u) On the expiration or sooner determination of the term hereby created or any renewal thereof, to peacefully and quietly yield up vacant possession of the Demised Premises and all fixtures fittings fastenings and matters and things thereto in anyway attached to and belonging or appertaining in good and tenantable repair (fair wear and tear and damage by lightning, storm, tempest, flood, Acts of God, riot and civil commotion only excepted) in accordance with the Tenant's covenants herein contained and with all locks and keys complete;</p>
            <p>(v) To restore the Demised Premises to its original position if any alterations or renovations have been made by the Tenant, if so desired by the Landlord, at the expiration or sooner determination of the term hereby created or any renewal thereof and provided that all costs and expense thereof shall be borne by the Tenant absolutely. The Tenant covenants that such restoration shall be completed by the expiration or sooner determination of this tenancy or any renewal thereof failing which the Landlord shall be at liberty (but not obliged) to carry out the same and the costs and expenses thereof shall be a debt immediately due by the Tenant to the Landlord and shall forthwith be recoverable by legal action. Further, in the event that such restorations shall not be completed upon the expiration or sooner determination of this tenancy or any renewal thereof, the Tenant shall pay to the Landlord double of the amount of the rental then payable for the tenancy of the Demised Premises for such extra number of days taken to complete the same; and</p>
            <p>(w) In the event that the Tenant should loss or misplace the access card and/or the car parking sticker (if applicable) in respect of the Demised Premises or should fail to return the said access card and/or sticker (if applicable) upon expiration or sooner determination of this tenancy, the Tenant shall reimburse the Landlord such sum(s) as may be imposed by the management office for the said omission.</p>

            <p><strong>4. LANDLORD'S COVENANTS</strong><br>The Landlord hereby covenants and undertakes with the Tenant as follows:-</p>
            <p>(a) To pay all quit rent, rates, taxes, assessments and other outgoings which are or may hereafter be charged or imposed upon the Demised Premises and payable by the Landlord (save and except those utilities that are payable by the Tenant as specifically mentioned herein before);</p>
            <p>(b) To insure and keep insured the Demised Premises from loss and damage by fire up to the full insurable value thereof and to pay all premium necessary for that purpose and in case of destruction or damage by fire (unless the insurance money becomes irrecoverable through any act, omission, default or negligence of the Tenant and/or their servants, agents, visitors, licensees or invitees) to rebuild and reinstate the same as speedily as possible;</p>
            <p>(c) To maintain and keep the main structure walls of the said Premises in good and tenantable repair and condition throughout the term hereby created unless such repairs are made necessary by reason of any act, omission, default or negligence of the Tenant and/or his servants, agents, visitors, licensees or invitees, then the Tenant shall forthwith carry out such repairs at his own cost and expense and in the event of the Tenant failing to carry out such repairs within fourteen (14) days of his being requested to do so, the Landlord shall be at liberty to attend to such repairs and the cost and expense thereof shall be a debt immediately due by the Tenant to the Landlord; and</p>
            <p>(d) To permit the Tenant, if he punctually pays the rent hereby reserved and any other monies payable by the Tenant under this Agreement and duly performs and observes the covenants, undertakings, obligations, stipulations and agreements on his part herein contained, to peaceably enjoy the Demised Premises during the term hereby created or until earlier determination of this tenancy or any renewal thereof without any interruption or disturbances by the Landlord.</p>

            <p><strong>5. EVENTS OF DEFAULT</strong></p>
            <p><strong>5.1</strong> In the event:-</p>
            <p>(a) the rent hereby reserved or any other monies payable by the Tenant under this Agreement or any part thereof shall at any time be in arrears and/or unpaid after the same shall have become due (whether the same shall have been legally or formally demanded or not);</p>
            <p>(b) the Tenant shall at any time fail, neglect, refuse or omit to perform and observe any of the covenants undertakings obligations stipulations and agreements on his part herein contained or if the Tenant shall commit any act of bankruptcy;</p>
            <p>(c) the Tenant shall commit any act of bankruptcy or suffers an adjudicating and receiving order to be made against him;</p>
            <p>(d) the Tenant suffers any distress or execution to be levied on his goods; and/or</p>
            <p>(e) the Tenant shall make any assignment for the benefit of or enter into any arrangement with his creditors;</p>
            <p>then and in any such cases it shall be lawful for the Landlord thereafter to serve a written notice upon the Tenant requiring the Tenant to remedy the relevant breach, if the same is capable of remedy, within a period of fourteen (14) days. Upon the expiration of the period of notice aforesaid or in the event the breach is incapable of remedy, the Landlord shall forthwith be entitled to terminate the tenancy of the Demised Premises whereupon the Landlord shall be entitled to immediately repossess the Demised Premises and to forthwith forfeit the Rental Deposit paid by the Tenant under Clause 2.1(a) hereof but without prejudice to any other rights or remedies which the Landlord may have against the Tenant arising from the said breach and/or as a result of the termination of this tenancy.</p>
            <p><strong>5.2</strong> Any acceptance of the rent hereby reserved by the Landlord from the Tenant shall not be deemed to operate as a waiver of any rights or remedies of the Landlord against the Tenant in respect of any breach of the covenants, undertakings, obligations, stipulations or agreements on the part of the Tenant hereunder.</p>

            <p><strong>6. INTEREST ON ARREARS</strong><br>
            In addition and without prejudice to any other rights or remedies of the Landlord, if the rent hereby reserved or any other monies payable by the Tenant under this Agreement or any part thereof shall not be paid at the time when such monies shall fall due for payment (whether legally or formally demanded or not), then the Tenant shall be liable to pay to the Landlord interest thereon at the rate of TEN percent (10%) per month from the due date to the date of full settlement. The Landlord shall be entitled to recover the said interest from the Tenant as if such interest were rent in arrears but nothing herein contained shall be deemed to restrict or prejudice any other rights or remedies which the Landlord may have against the Tenant in respect of the said outstanding monies.</p>

            <p><strong>7. REMAINING IN POSSESSION UPON EXPIRATION OR DETERMINATION OF TENANCY</strong><br>
            If upon the expiration or sooner determination of the tenancy hereby created or any renewal thereof, the Tenant shall remain in possession of the Demised Premises without the prior written consent of the Landlord, the Tenant shall be liable to pay to the Landlord double the amount of the rental then payable for the tenancy of the Demised Premises for each day that the Tenant shall remain on the Demised Premises and to compensate the Landlord for any loss of rent suffered by the Landlord as a result thereof but nothing herein contained shall be deemed to restrict or prejudice any other rights or remedies which the Landlord may have to enforce this Agreement against the Tenant to deliver up vacant possession of the Demised Premises in accordance with Clauses 3 (u) and (v) above.</p>

            <p><strong>8. DAMAGE TO DEMISED PREMISES</strong></p>
            <p><strong>8.1</strong> If the Demised Premises or any part thereof shall at any time during the tenancy thereof be destroyed or damaged by fire, lightning, storm, tempest, flood, riots, civil commotion, Act of God or other inevitable cause (except where such events had been caused by the act default neglect error or omission of the Tenant, his servants, agents, licensees, invitees or visitors) so as to become unfit for occupation or use, then the rent hereby covenanted to be paid or a fair proportion thereof according to the nature and extent of the damage or destruction sustained shall be suspended until the Demised Premises shall again be rendered fit for occupation or use.</p>
            <p><strong>8.2</strong> If the Demised Premises continues to be unfit for occupation or use for a period of thirty (30) days from the date of the happening of destruction or damage as aforesaid, the Tenant may notwithstanding anything herein contained give the Landlord not less than fourteen (14) days' written notice of his intention to surrender the Demised Premises to the Landlord. This tenancy shall thereafter cease but without prejudice to the rights and remedies of the Landlord in respect of any antecedent breach by the Tenant.</p>
            <p><strong>8.3</strong> The Landlord shall not in any event be bound or compelled to rebuild or reinstate the Demised Premises or any part thereof unless the Landlord shall in his absolute discretion think fit.</p>

            <p><strong>9. TERMINATION OF TENANCY</strong><br>
            The Tenant shall not be allowed to terminate this tenancy prior to the expiry of the term hereby created. If the Tenant shall be desirous of terminating this tenancy before the expiry of the term hereby created, the Tenant shall give a TWO (2) MONTHS' notice of termination in writing to the Landlord and the Landlord shall be entitled to forfeit the Rental Deposit absolutely and the Tenant shall also be liable to compensate the Landlord the rentals for the remaining months of the term hereby created as agreed liquidated damages but nothing herein contained shall be deemed to restrict or prejudice any other rights or remedies which the Landlord may have against the Tenant for any antecedent breach of the covenants, undertakings, obligations, stipulations and agreements on the part of the Tenant herein contained.</p>

            <p><strong>10. RENEWAL OF TENANCY</strong><br>
            If the Tenant shall be desirous of renewing this tenancy for a further term from the expiration of the term hereby created the Tenant shall give a two (2) months' notice in writing before the expiration of the term hereby created, of the Tenant's desire (provided if the Tenant shall have paid the rent hereby reserved and shall have performed and observed the several stipulations herein contained and on the Tenant's part to be performed and observed up to the expiration of the term hereby created) then the Landlord will let the Premises to the Tenant for a further term as specified in <strong>Part 5(B) of the First Schedule</strong> from the expiration of the term hereby created at a rental to be mutually agreed between the parties hereto based on the prevailing market rate at the time of the renewal and the renewal shall be subject in all other respects to the same terms and conditions as this Agreement save and except this provision for renewal.</p>

            <p><strong>11. TIME</strong><br>Time wherever mentioned in this Agreement shall be of the essence of this Agreement.</p>

            <p><strong>12. COSTS</strong><br>All stamp duty and other costs and expenses (save and except for the Tenant's solicitors' costs, if any) incurred or to be incurred in relation to the preparation, execution and completion of this Agreement shall be borne and paid by the Tenant absolutely.</p>

            <p><strong>13. NOTICES</strong></p>
            <p><strong>13.1</strong> All notices hereunder shall be in writing signed by the parties by whom it is served or by its solicitors and shall be sufficiently given if left by hand at or sent by registered post or telefax either to the party to whom such notice is addressed at its address stated herein or to such other address as such party may notify to the other party in writing or to such party's solicitor or agents duly authorised. Any notices so sent or delivered shall be deemed to have been served and received:-</p>
            <p>(a) if by hand, on the same day of despatch;</p>
            <p>(b) if by post, on the third day after posting; and</p>
            <p>(c) if by facsimile, on a Working Day (which shall exclude Saturday, Sunday and such gazetted public holidays in the state of Wilayah Persekutuan and Selangor), immediately after successful transmission thereof and evidenced by the transmission report at the receiving address.</p>
            <p><strong>13.2</strong> Any service of legal process which includes writ of summons and other pleadings may be sent to the parties by prepared registered post to the address stated herein and the same shall be deemed to have been duly served and duly received by the parties upon the expiry of three (3) days after the day of posting of the same.</p>
            <p><strong>13.3</strong> No change in address for service howsoever brought about shall be effective or binding on the parties unless actual notice of such change has been given to the other party.</p>

            <p><strong>14. WAIVER</strong><br>Any indulgence given by the Landlord in respect of any covenants, undertakings, stipulations, obligations or agreements to be performed or observed by the Tenant or the neglect or forbearance by the Landlord in enforcing any of his rights or remedies herein this Agreement contained shall not constitute or be construed as a waiver of or prejudice the Landlord's said rights and remedies.</p>

            <p><strong>15. GOVERNING LAW</strong><br>This Agreement shall be governed by the laws of Malaysia.</p>

            <p><strong>16. SEVERABILITY</strong><br>In the event that any one or more of the provisions contained in this Agreement or their performance thereof shall for any reason be held to be unenforceable illegal or otherwise invalid in any respect under the law governing this Agreement, such unenforceability, illegality or invalidity shall not affect the remaining provisions of the relevant clause(s) or any other provisions of this Agreement and this Agreement shall then be construed as if such unenforceable, illegal or invalid provisions had never been contained herein.</p>

            <p><strong>17. BINDING EFFECT</strong><br>This Agreement shall be binding on the heirs, personal representatives and assigns of the Landlord and the Tenant respectively.</p>

            <p><strong>18. INTERPRETATIONS</strong></p>
            <p><strong>18.1</strong> The Schedules hereto shall have full effect and shall be read as part of this Agreement as if they were incorporated herein and this Agreement together with the said Schedules shall constitute the whole agreement between the parties hereto and it is expressly declared that no variation hereof shall be effective unless made by the parties hereto in writing.</p>
            <p><strong>18.2</strong> The headings in this Agreement are for ease of reference only and shall not be taken into account in the construction or interpretation of the clause(s) to which they refer.</p>
            <p><strong>18.3</strong> Words importing the singular meaning where the context so admits include the plural meaning and vice versa.</p>
            <p><strong>18.4</strong> Words of the masculine gender include the feminine and neuter genders and words denoting natural persons include corporations and firms and all such words shall be construed interchangeably in that manner.</p>
            <p><strong>18.5</strong> Words denoting an obligation on a party to do any act matter or thing include an obligation to procure that it be done and words placing a party under a restriction include an obligation not to permit infringement of the restriction.</p>
            <p><strong>18.6</strong> Where two or more persons are included in the expression the "Landlord" or the "Tenant", agreements, covenants, stipulations and undertakings expressed to be made by the Landlord and the Tenant and promises made to the Landlord and the Tenant, as the case may be, shall be deemed respectively to be made by and be binding on and enforceable by such persons jointly and severally.</p>
        </div>

        <div class="page-break">
            <p><strong>IN WITNESS WHEREOF</strong> the Landlord and the Tenant have set their hands the day and year set out in Part 1 of the First Schedule of this Agreement.</p>
            
            <table class="signature-table">
                <tr>
                    <td>
                        <strong>Signed by the Landlord</strong><br>
                        in the presence of:-
                        <br><br><br><br>
                        <div class="sign-line"></div>
                        Name: <strong>${owner.fullName || ''}</strong><br>
                        NRIC: ${owner.icPassport || ''}
                    </td>
                    <td>
                        <strong>Signed by the Tenant</strong><br>
                        in the presence of:-
                        <br><br><br><br>
                        <div class="sign-line"></div>
                        Name: <strong>${tenant.fullName || ''}</strong><br>
                        NRIC: ${tenant.icPassport || ''}
                    </td>
                </tr>
            </table>
        </div>

        <div class="page-break">
            <div class="schedule-title">THE FIRST SCHEDULE</div>
            <p class="text-center" style="margin-bottom: 20px;">(Which shall be taken and read as an essential part of this Agreement)</p>

            <table class="schedule">
                <tr>
                    <td class="col-part">PART 1</td>
                    <td class="col-desc">DATE OF AGREEMENT</td>
                    <td class="col-val">${formatDate(data.date)}</td>
                </tr>
                <tr>
                    <td class="col-part">PART 2</td>
                    <td class="col-desc">NAME & ADDRESS OF THE LANDLORD</td>
                    <td class="col-val">
                        <strong>${owner.fullName}</strong><br>
                        ${owner.address || 'Address not provided'}
                    </td>
                </tr>
                <tr>
                    <td class="col-part">PART 3</td>
                    <td class="col-desc">NAME & ADDRESS OF THE TENANT</td>
                    <td class="col-val">
                        <strong>${tenant.fullName}</strong><br>
                        ${tenant.regAddress || 'Address as per NRIC'}
                    </td>
                </tr>
                <tr>
                    <td class="col-part">PART 4</td>
                    <td class="col-desc">DEMISED PREMISES</td>
                    <td class="col-val">
                        ${prop.name}<br>
                        ${prop.address}, ${prop.city}, ${prop.state}
                    </td>
                </tr>
                <tr>
                    <td class="col-part">PART 5</td>
                    <td class="col-desc">(A) FIXED TERM<br>(B) RENEWAL TERM</td>
                    <td class="col-val">
                        (A) ${tenant.leaseTerm || '12'} Months<br>
                        (B) 1 Year (subject to renewal)
                    </td>
                </tr>
                <tr>
                    <td class="col-part">PART 6</td>
                    <td class="col-desc">COMMENCEMENT DATE</td>
                    <td class="col-val">${formatDate(tenant.leaseStart)}</td>
                </tr>
                <tr>
                    <td class="col-part">PART 7</td>
                    <td class="col-desc">EXPIRY DATE</td>
                    <td class="col-val">${formatDate(tenant.leaseEnd)}</td>
                </tr>
                <tr>
                    <td class="col-part">PART 8</td>
                    <td class="col-desc">MONTHLY RENTAL</td>
                    <td class="col-val">
                        <strong>RM ${formatMoney(monthlyRent)}</strong>
                    </td>
                </tr>
                <tr>
                    <td class="col-part">PART 8<br>(Cont.)</td>
                    <td class="col-desc">LANDLORD BANK ACCOUNT</td>
                    <td class="col-val">
                        ${owner.bankDetails || 'To be advised'}
                    </td>
                </tr>
                <tr>
                    <td class="col-part">PART 9</td>
                    <td class="col-desc">RENTAL DEPOSIT</td>
                    <td class="col-val">RM ${formatMoney(securityDep)}</td>
                </tr>
                <tr>
                    <td class="col-part">PART 10</td>
                    <td class="col-desc">UTILITIES DEPOSIT</td>
                    <td class="col-val">RM ${formatMoney(utilityDep)}</td>
                </tr>
                <tr>
                    <td class="col-part">PART 11</td>
                    <td class="col-desc">OTHER DEPOSIT</td>
                    <td class="col-val">N/A</td>
                </tr>
                <tr>
                    <td class="col-part">PART 12</td>
                    <td class="col-desc">PERMITTED USE</td>
                    <td class="col-val">RESIDENTIAL ONLY</td>
                </tr>
            </table>
        </div>

    </body>
    </html>
    `;
};
