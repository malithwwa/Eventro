import {BASE_URL} from "@/lib/constants";
import Image from "next/image";
import {notFound} from "next/navigation";
import BookEvent from "@/components/BookEvent";

const EventDetailsItem = ({icon, alt, label}: { icon: string; alt: string, label: string }) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17}/>
        <p>{label}</p>
    </div>
)

const EventAgenda = ({agendaItems}: { agendaItems: string[] }) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    </div>
)

const EventTags = ({tags}: { tags: string[] }) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {tags.map((tag, index) => (
            <div className="pill" key={index}>
                {tag}
            </div>
        ))}
    </div>
)
const EventDetailsPage = async ({params}: { params: Promise<{ slug: string }> }) => {
    const {slug} = await params;
    let event;

    try {
        const request = await fetch(`${BASE_URL}/events/${slug}`, {next: {revalidate: 60}});

        if (!request.ok) {
            if (request.status === 404) return notFound();
            throw new Error(`Failed to fetch event: ${request.statusText}`);
        }
        const response = await request.json();
        event = response.event;

        if (!event) return notFound();

    } catch (e) {
        console.error(e);
        return notFound();
    }
    const {
        title,
        description,
        image,
        overview,
        date,
        time,
        location,
        mode,
        agenda,
        audience,
        tags, organizer
    } = event;

    const bookings = 10;
    return (
        <section id="event">
            <div className="header">
                <h1 className="title">{title}</h1>
                <p>{description}</p>
            </div>
            <div className="details">
                {/*Left side - Event Content */}
                <div className="content">
                    <Image src={image} alt="Event Banner" width={800} height={800} className="banner"/>

                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailsItem icon="/icons/calendar.svg" alt="calendar" label={date}/>
                        <EventDetailsItem icon="/icons/clock.svg" alt="clock" label={time}/>
                        <EventDetailsItem icon="/icons/pin.svg" alt="location" label={location}/>
                        <EventDetailsItem icon="/icons/mode.svg" alt="mode" label={mode}/>
                        <EventDetailsItem icon="/icons/audience.svg" alt="audience" label={audience}/>
                    </section>

                    <EventAgenda agendaItems={JSON.parse(agenda[0])}/>

                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={JSON.parse(tags[0])}/>
                </div>

                {/*Right side - Booking Form */}
                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        {bookings > 0 ? (
                            <p className="text-sm">
                                Join {bookings} People who have aleady booked their Spots!
                            </p>
                        ) : (
                            <p className="text-sm">Be the First to Book Your Spot!</p>
                        )}
                        <BookEvent/>
                    </div>
                </aside>
            </div>
        </section>
    )
}
export default EventDetailsPage
