import React from 'react'

export default function CalenderTabs() {
    return (
        <div>

            <div className="container py-5">


                <div className="calender-tabs-col">
                    <nav>
                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                            <button class="nav-link active" id="nav-meetings-tab" data-bs-toggle="tab" data-bs-target="#nav-meetings"
                                type="button" role="tab" aria-controls="nav-home" aria-selected="true">Meetings</button>
                            <button class="nav-link" id="nav-working-hours-tab" data-bs-toggle="tab" data-bs-target="#nav-working-hours"
                                type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Working hours</button>
                            <button class="nav-link" id="nav-events-tab" data-bs-toggle="tab" data-bs-target="#nav-events"
                                type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Contact</button>

                        </div>
                    </nav>
                </div>

                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-meetings" role="tabpanel" aria-labelledby="nav-meetings-tab" tabindex="0">...</div>
                    <div class="tab-pane fade" id="nav-working-hours" role="tabpanel" aria-labelledby="nav-working-hours-tab" tabindex="0">...</div>
                    <div class="tab-pane fade" id="nav-events" role="tabpanel" aria-labelledby="nav-events-tab" tabindex="0">...</div>

                </div>

            </div>

        </div>
    )
}
