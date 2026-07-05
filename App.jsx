import { useState, useEffect } from "react";
import {
  Home,
  MapPin,
  MessageCircle,
  Heart,
  Send,
  X,
  Users,
  Trophy,
  Navigation,
  ChevronLeft,
  Flag,
  Plus,
} from "lucide-react";

const SPORTS = [
  { id: "chess", label: "Chess", abbr: "CHS", color: "slate" },
  { id: "football", label: "Football", abbr: "FUT", color: "emerald" },
  { id: "cricket", label: "Cricket", abbr: "CKT", color: "amber" },
  { id: "running", label: "Running", abbr: "RUN", color: "orange" },
  { id: "badminton", label: "Badminton", abbr: "BAD", color: "sky" },
  { id: "dodgeball", label: "Dodgeball", abbr: "DGB", color: "rose" },
  { id: "volleyball", label: "Volleyball", abbr: "VBL", color: "violet" },
  { id: "other", label: "Other", abbr: "OTH", color: "stone" },
];

function sportMeta(id) {
  return SPORTS.find((s) => s.id === id) || SPORTS[SPORTS.length - 1];
}

const HOME = { lat: 51.5074, lon: -0.1278 }; // demo location: central London

const MOCK_PLAYERS = [
  { id: 1, name: "Maya Chen", sport: "football", initials: "MC", lat: 51.512, lon: -0.121 },
  { id: 2, name: "Arjun Patel", sport: "cricket", initials: "AP", lat: 51.483, lon: -0.115 },
  { id: 3, name: "Sofia Reyes", sport: "running", initials: "SR", lat: 51.526, lon: -0.148 },
  { id: 4, name: "Liam O'Connor", sport: "badminton", initials: "LO", lat: 51.5, lon: -0.141 },
  { id: 5, name: "Noor Hassan", sport: "volleyball", initials: "NH", lat: 51.494, lon: -0.156 },
  { id: 6, name: "Devon Brooks", sport: "dodgeball", initials: "DB", lat: 51.52, lon: -0.089 },
  { id: 7, name: "Priya Nair", sport: "chess", initials: "PN", lat: 51.505, lon: -0.099 },
];

const ME = { id: "me", name: "You", initials: "Y", sport: null };

const INITIAL_GROUNDS = [
  { id: 1, name: "Riverside Football Turf", sport: "football", lat: 51.512, lon: -0.121, verified: true },
  { id: 2, name: "Regents Running Loop", sport: "running", lat: 51.526, lon: -0.155, verified: true },
  { id: 3, name: "Oval Cricket Nets", sport: "cricket", lat: 51.483, lon: -0.115, verified: false },
  { id: 4, name: "Ace Badminton Hall", sport: "badminton", lat: 51.5, lon: -0.141, verified: true },
  { id: 5, name: "Bishop's Chess Club", sport: "chess", lat: 51.505, lon: -0.099, verified: false },
  { id: 6, name: "Beachside Volleyball Court", sport: "volleyball", lat: 51.494, lon: -0.156, verified: false },
  { id: 7, name: "Dodgeball Arena East", sport: "dodgeball", lat: 51.52, lon: -0.089, verified: true },
  { id: 8, name: "All-Sports Community Centre", sport: "other", lat: 51.509, lon: -0.128, verified: true },
];

// Same great-circle formula as the Django backend's apps/geo/services.py
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dPhi = toRad(lat2 - lat1);
  const dLambda = toRad(lon2 - lon1);
  const a =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLambda / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Local equirectangular projection, just for plotting dots on the radar view
function project(lat, lon, center, radiusKm) {
  const kmPerDegLat = 110.574;
  const kmPerDegLon = 111.32 * Math.cos((center.lat * Math.PI) / 180);
  const dxKm = (lon - center.lon) * kmPerDegLon;
  const dyKm = (lat - center.lat) * kmPerDegLat;
  const xPct = 50 + (dxKm / radiusKm) * 48;
  const yPct = 50 - (dyKm / radiusKm) * 48;
  return {
    x: Math.min(96, Math.max(4, xPct)),
    y: Math.min(96, Math.max(4, yPct)),
  };
}

const INITIAL_POSTS = [
  { id: "p1", authorId: 1, sport: "football", content: "5-a-side at Riverside this evening, need 2 more players!", locationLabel: "Riverside Football Turf", time: "2h ago", likes: 14, liked: false },
  { id: "p2", authorId: 7, sport: "chess", content: "Anyone up for a blitz rematch at the club tonight?", locationLabel: "Bishop's Chess Club", time: "4h ago", likes: 6, liked: false },
  { id: "p3", authorId: 3, sport: "running", content: "New 10K PB this morning \u2014 42:18! Who's joining Sunday's group run?", locationLabel: "Regents Running Loop", time: "6h ago", likes: 23, liked: true },
  { id: "p4", authorId: 2, sport: "cricket", content: "Looking for a wicketkeeper for Saturday's league match.", locationLabel: "Oval Cricket Nets", time: "1d ago", likes: 9, liked: false },
];

const INITIAL_ROOMS = [
  {
    id: "r1", name: "Riverside FC Squad", isTeam: true, replyName: "Maya Chen",
    replies: ["Sounds good, see you at kickoff.", "I'll bring the extra bibs.", "Confirmed \u2014 7pm at Riverside."],
    messages: [
      { id: 1, sender: "Maya Chen", isMe: false, text: "Kickoff moved to 7pm, ground's confirmed.", time: "10:12" },
      { id: 2, sender: "You", isMe: true, text: "Got it, see you there.", time: "10:15" },
    ],
  },
  {
    id: "r2", name: "Priya Nair", isTeam: false, replyName: "Priya Nair",
    replies: ["Great, I'll set up the board.", "See you at 8, don't be late!"],
    messages: [
      { id: 1, sender: "Priya Nair", isMe: false, text: "Rematch tonight? 8pm at the club.", time: "09:40" },
    ],
  },
  {
    id: "r3", name: "Weekend Cricket XI", isTeam: true, replyName: "Arjun Patel",
    replies: ["Perfect, added you to the XI.", "Nets at 9am tomorrow \u2014 bring your gloves."],
    messages: [
      { id: 1, sender: "Arjun Patel", isMe: false, text: "Need a keeper for Saturday \u2014 you free?", time: "Yesterday" },
      { id: 2, sender: "You", isMe: true, text: "Yep, count me in.", time: "Yesterday" },
    ],
  },
];

function SportChip({ label, selected, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        "px-2.5 py-1 rounded-full text-xs font-mono font-semibold tracking-wide border whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 " +
        (selected
          ? `bg-${color}-600 text-white border-${color}-600`
          : `bg-white text-${color}-700 border-${color}-300`)
      }
    >
      {label}
    </button>
  );
}

function Avatar({ initials, sport, size }) {
  const color = sport ? sportMeta(sport).color : "stone";
  const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${dim} rounded-full bg-${color}-800 text-stone-50 font-bold flex items-center justify-center shrink-0`}>
      {initials}
    </div>
  );
}

function ProfileModal({ player, onClose, onChallenge, onInvite }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-stone-950/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-xs p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Avatar initials={player.initials} sport={player.sport} />
            <div>
              <div className="font-bold text-stone-900 leading-tight">{player.name}</div>
              <div className="text-xs font-mono text-stone-400 uppercase tracking-wide">
                {player.sport ? sportMeta(player.sport).label : "Player"}
                {player.distance != null ? ` \u00b7 ${player.distance.toFixed(1)} km away` : ""}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded p-1">
            <X size={18} />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onChallenge(player)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <Trophy size={16} /> Challenge
          </button>
          <button
            onClick={() => onInvite(player)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-sm py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <Users size={16} /> Invite to Team
          </button>
        </div>
      </div>
    </div>
  );
}

function Radar({ center, radiusKm, grounds, players }) {
  const rings = [1, 2, 3];
  return (
    <div className="relative w-full aspect-square rounded-full bg-emerald-950 border border-emerald-900 overflow-hidden mb-3">
      {rings.map((step, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-emerald-800"
          style={{
            width: `${(step / 3) * 96}%`,
            height: `${(step / 3) * 96}%`,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
      <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-mono text-emerald-400">
        {radiusKm.toFixed(0)} km
      </span>

      {grounds.map((g) => {
        const p = project(g.lat, g.lon, center, radiusKm);
        const color = sportMeta(g.sport).color;
        return (
          <div
            key={`g-${g.id}`}
            className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div className={`w-2.5 h-2.5 rounded-full bg-${color}-400 border border-white shrink-0`} />
            <span
              className="mt-0.5 text-xs font-mono text-stone-50 whitespace-nowrap leading-tight"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
            >
              {g.name}
            </span>
          </div>
        );
      })}

      {players.map((pl) => {
        const p = project(pl.lat, pl.lon, center, radiusKm);
        const color = sportMeta(pl.sport).color;
        return (
          <div
            key={`pl-${pl.id}`}
            title={pl.name}
            className={`absolute w-2.5 h-2.5 rounded-full bg-transparent border-2 border-${color}-300 -translate-x-1/2 -translate-y-1/2`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          />
        );
      })}

      <div
        className="absolute w-3 h-3 rounded-full bg-orange-500 border-2 border-white -translate-x-1/2 -translate-y-1/2 animate-pulse"
        style={{ left: "50%", top: "50%" }}
      />
    </div>
  );
}

function FeedView({ posts, onToggleLike, onOpenProfile, getAuthor, composerProps }) {
  const {
    newPostText, setNewPostText, newPostSport, setNewPostSport,
    attachLocation, setAttachLocation, postError, onSubmit,
  } = composerProps;

  return (
    <div>
      <div className="bg-white rounded-2xl border border-stone-200 p-3 mb-3 shadow-sm">
        <textarea
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="What's the plan? Share an update, a call for players, a result..."
          rows={2}
          className="w-full text-sm text-stone-800 placeholder-stone-400 resize-none focus:outline-none"
        />
        {postError && <div className="text-xs text-orange-600 font-medium mb-1">{postError}</div>}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <select
              value={newPostSport}
              onChange={(e) => setNewPostSport(e.target.value)}
              className="text-xs font-mono border border-stone-300 rounded-lg px-2 py-1.5 text-stone-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">No sport tag</option>
              {SPORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <button
              onClick={() => setAttachLocation((v) => !v)}
              className={
                "flex items-center gap-1 text-xs font-mono px-2 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 " +
                (attachLocation ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white border-stone-300 text-stone-500")
              }
            >
              <MapPin size={13} /> Location
            </button>
          </div>
          <button
            onClick={onSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-4 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            Post
          </button>
        </div>
      </div>

      {posts.length === 0 && (
        <div className="text-center text-sm text-stone-400 py-10">No posts tagged for this sport yet. Be the first to share one.</div>
      )}

      {posts.map((post) => {
        const author = getAuthor(post.authorId);
        const meta = post.sport ? sportMeta(post.sport) : null;
        return (
          <div key={post.id} className="bg-white rounded-2xl border border-stone-200 p-3 mb-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => onOpenProfile(author)} className="focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-full">
                <Avatar initials={author.initials} sport={author.sport} size="sm" />
              </button>
              <div className="flex-1 min-w-0">
                <button onClick={() => onOpenProfile(author)} className="font-bold text-sm text-stone-900 hover:underline">
                  {author.name}
                </button>
                <div className="text-xs font-mono text-stone-400 truncate">
                  {post.time}
                  {post.locationLabel ? ` \u00b7 ${post.locationLabel}` : ""}
                </div>
              </div>
              {meta && (
                <span className={`shrink-0 whitespace-nowrap text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-${meta.color}-100 text-${meta.color}-700 border border-${meta.color}-200`}>
                  {meta.label}
                </span>
              )}
            </div>
            <p className="text-sm text-stone-700 leading-relaxed mb-2">{post.content}</p>
            <button onClick={() => onToggleLike(post.id)} className="flex items-center gap-1 focus:outline-none">
              <Heart size={15} className={post.liked ? "fill-orange-500 text-orange-500" : "text-stone-400"} />
              <span className={"text-xs font-mono " + (post.liked ? "text-orange-600" : "text-stone-500")}>{post.likes}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function DiscoverView({ userLocation, setUserLocation, radiusKm, setRadiusKm, selectedSport, grounds, players, onOpenProfile, locStatus, onUseDeviceLocation }) {
  return (
    <div>
      <div className="bg-white rounded-2xl border border-stone-200 p-3 mb-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-xs font-mono text-stone-500">LAT</label>
          <input
            type="number"
            step="0.001"
            value={userLocation.lat}
            onChange={(e) => setUserLocation((u) => ({ ...u, lat: parseFloat(e.target.value) || 0 }))}
            className="w-20 text-xs font-mono border border-stone-300 rounded px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <label className="text-xs font-mono text-stone-500">LON</label>
          <input
            type="number"
            step="0.001"
            value={userLocation.lon}
            onChange={(e) => setUserLocation((u) => ({ ...u, lon: parseFloat(e.target.value) || 0 }))}
            className="w-20 text-xs font-mono border border-stone-300 rounded px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={onUseDeviceLocation}
            className="ml-auto flex items-center gap-1 text-xs font-mono bg-emerald-950 text-stone-50 px-2 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <Navigation size={13} /> Use my GPS
          </button>
        </div>
        {locStatus && <div className="text-xs text-stone-400 mb-2">{locStatus}</div>}
        {selectedSport && (
          <div className="text-xs text-stone-400 mb-2">Filtering by {sportMeta(selectedSport).label}</div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-stone-500 shrink-0">Radius</span>
          <input
            type="range"
            min="1"
            max="15"
            value={radiusKm}
            onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
            className="flex-1 accent-orange-500"
          />
          <span className="text-xs font-mono font-semibold text-stone-700 w-12 text-right">{radiusKm} km</span>
        </div>
      </div>

      <Radar center={userLocation} radiusKm={radiusKm} grounds={grounds} players={players} />

      {players.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-bold uppercase tracking-wide text-stone-500 mb-1.5">Players nearby</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {players.map((pl) => (
              <button
                key={pl.id}
                onClick={() => onOpenProfile(pl)}
                className="flex flex-col items-center gap-1 shrink-0 w-16 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg p-1"
              >
                <Avatar initials={pl.initials} sport={pl.sport} />
                <span className="text-xs text-stone-700 truncate w-full text-center">{pl.name.split(" ")[0]}</span>
                <span className="text-xs font-mono text-emerald-700">{pl.distance.toFixed(1)}km</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs font-bold uppercase tracking-wide text-stone-500 mb-1.5">Grounds</div>
      {grounds.length === 0 && (
        <div className="text-center text-sm text-stone-400 py-8">No grounds in this radius yet \u2014 try widening it or clearing the sport filter.</div>
      )}
      {grounds.map((g) => {
        const meta = sportMeta(g.sport);
        return (
          <div key={g.id} className="flex items-center justify-between bg-white rounded-xl border border-stone-200 px-3 py-2.5 mb-2">
            <div className="min-w-0">
              <div className="font-bold text-sm text-stone-900 truncate">{g.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`whitespace-nowrap text-xs font-mono font-semibold px-2 py-0.5 rounded bg-${meta.color}-100 text-${meta.color}-700`}>{meta.label}</span>
                {g.verified && <span className="text-xs font-mono text-amber-600">Verified</span>}
              </div>
            </div>
            <div className="text-sm font-mono font-bold text-emerald-700 shrink-0 ml-2">{g.distance.toFixed(1)} km</div>
          </div>
        );
      })}

      <p className="text-xs text-stone-400 text-center mt-2 px-4">
        Simplified radar view for this preview \u2014 swap in Leaflet or Mapbox for real map tiles in production.
      </p>
    </div>
  );
}

function GroundsView({ grounds, onRegisterClick }) {
  return (
    <div>
      <button
        onClick={onRegisterClick}
        className="w-full flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-2.5 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        <Plus size={16} /> Register a Ground
      </button>

      <div className="text-xs font-bold uppercase tracking-wide text-stone-500 mb-1.5">All Grounds</div>

      {grounds.length === 0 && (
        <div className="text-center text-sm text-stone-400 py-8">No grounds registered for this sport yet. Be the first to register one.</div>
      )}

      {grounds.map((g) => {
        const meta = sportMeta(g.sport);
        return (
          <div key={g.id} className="flex items-center justify-between bg-white rounded-xl border border-stone-200 px-3 py-2.5 mb-2">
            <div className="min-w-0">
              <div className="font-bold text-sm text-stone-900 truncate">{g.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`whitespace-nowrap text-xs font-mono font-semibold px-2 py-0.5 rounded bg-${meta.color}-100 text-${meta.color}-700`}>{meta.label}</span>
                {g.verified && <span className="text-xs font-mono text-amber-600">Verified</span>}
              </div>
            </div>
            <div className="text-sm font-mono font-bold text-emerald-700 shrink-0 ml-2">{g.distance.toFixed(1)} km</div>
          </div>
        );
      })}
    </div>
  );
}

function RegisterGroundModal({ onClose, onSubmit, userLocation }) {
  const [name, setName] = useState("");
  const [sport, setSport] = useState(SPORTS[0].id);
  const [error, setError] = useState("");

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Add a name before you register this ground.");
      return;
    }
    onSubmit({ name: trimmed, sport });
  }

  return (
    <div className="fixed inset-0 bg-stone-950/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-xs p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold text-stone-900">Register a Ground</div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded p-1">
            <X size={18} />
          </button>
        </div>

        <label className="text-xs font-mono text-stone-500 block mb-1">GROUND NAME</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Riverside Football Turf"
          className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {error && <div className="text-xs text-orange-600 font-medium mb-2">{error}</div>}

        <label className="text-xs font-mono text-stone-500 block mb-1">SPORT</label>
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {SPORTS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>

        <div className="text-xs text-stone-400 mb-3">
          We'll list it at your current location ({userLocation.lat.toFixed(3)}, {userLocation.lon.toFixed(3)}) \u2014 adjust that on the Discover tab first if needed.
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          Register
        </button>
      </div>
    </div>
  );
}

function ChatRoomList({ rooms, onOpen }) {
  return (
    <div>
      {rooms.map((r) => {
        const last = r.messages[r.messages.length - 1];
        return (
          <button
            key={r.id}
            onClick={() => onOpen(r.id)}
            className="w-full text-left flex items-center gap-2.5 bg-white rounded-xl border border-stone-200 px-3 py-2.5 mb-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <div className="w-10 h-10 rounded-full bg-sky-900 text-stone-50 flex items-center justify-center shrink-0">
              {r.isTeam ? (
                <Users size={17} />
              ) : (
                <span className="text-xs font-bold">
                  {r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-stone-900 truncate">{r.name}</div>
              <div className="text-xs text-stone-400 truncate">{last ? `${last.isMe ? "You: " : ""}${last.text}` : "No messages yet"}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ChatThread({ room, onBack, draft, setDraft, onSend }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-stone-200 shrink-0 bg-white">
        <button onClick={onBack} className="text-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded p-0.5">
          <ChevronLeft size={20} />
        </button>
        <div className="min-w-0">
          <div className="font-bold text-sm text-stone-900 truncate">{room.name}</div>
          <div className="text-xs text-stone-400">Simulated replies for this preview</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-2">
        {room.messages.map((m) => (
          <div key={m.id} className={"flex " + (m.isMe ? "justify-end" : "justify-start")}>
            <div
              className={
                "max-w-xs px-3 py-1.5 rounded-2xl text-sm " +
                (m.isMe ? "bg-orange-500 text-white rounded-br-sm" : "bg-white border border-stone-200 text-stone-800 rounded-bl-sm")
              }
            >
              {m.text}
              <div className={"text-xs font-mono mt-0.5 " + (m.isMe ? "text-orange-100" : "text-stone-400")}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-2.5 border-t border-stone-200 shrink-0 bg-white">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Message"
          className="flex-1 text-sm border border-stone-300 rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button onClick={onSend} className="bg-emerald-950 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-orange-400">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export default function MatchdayApp() {
  const [tab, setTab] = useState("feed");
  const [selectedSport, setSelectedSport] = useState(null);

  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState("");
  const [newPostSport, setNewPostSport] = useState("");
  const [attachLocation, setAttachLocation] = useState(false);
  const [postError, setPostError] = useState("");

  const [userLocation, setUserLocation] = useState(HOME);
  const [radiusKm, setRadiusKm] = useState(5);
  const [locStatus, setLocStatus] = useState("");

  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [chatDraft, setChatDraft] = useState("");

  const [groundsList, setGroundsList] = useState(INITIAL_GROUNDS);
  const [showRegisterGround, setShowRegisterGround] = useState(false);

  const [profilePlayer, setProfilePlayer] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  function getAuthor(id) {
    if (id === "me") return ME;
    return MOCK_PLAYERS.find((p) => p.id === id) || ME;
  }

  const visiblePosts = selectedSport ? posts.filter((p) => p.sport === selectedSport) : posts;

  const groundsWithDistance = groundsList
    .map((g) => ({ ...g, distance: haversineKm(userLocation.lat, userLocation.lon, g.lat, g.lon) }))
    .filter((g) => g.distance <= radiusKm)
    .filter((g) => !selectedSport || g.sport === selectedSport)
    .sort((a, b) => a.distance - b.distance);

  // Full directory for the Grounds tab: same sport filter, but not limited by radius.
  const allGroundsWithDistance = groundsList
    .map((g) => ({ ...g, distance: haversineKm(userLocation.lat, userLocation.lon, g.lat, g.lon) }))
    .filter((g) => !selectedSport || g.sport === selectedSport)
    .sort((a, b) => a.distance - b.distance);

  const playersWithDistance = MOCK_PLAYERS
    .map((p) => ({ ...p, distance: haversineKm(userLocation.lat, userLocation.lon, p.lat, p.lon) }))
    .filter((p) => p.distance <= radiusKm)
    .filter((p) => !selectedSport || p.sport === selectedSport)
    .sort((a, b) => a.distance - b.distance);

  function handleAddPost() {
    const text = newPostText.trim();
    if (!text) {
      setPostError("Add a few words before you post.");
      return;
    }
    setPosts((p) => [
      {
        id: `me-${Date.now()}`,
        authorId: "me",
        sport: newPostSport || null,
        content: text,
        locationLabel: attachLocation ? "Shared from your location" : "",
        time: "Just now",
        likes: 0,
        liked: false,
      },
      ...p,
    ]);
    setNewPostText("");
    setNewPostSport("");
    setAttachLocation(false);
    setPostError("");
  }

  function handleToggleLike(id) {
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)));
  }

  function handleUseDeviceLocation() {
    if (!navigator.geolocation) {
      setLocStatus("Geolocation isn't available in this preview.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocStatus("Using your device location.");
      },
      () => setLocStatus("Couldn't access device location here \u2014 staying on the demo location."),
      { timeout: 5000 }
    );
  }

  function handleSendChat() {
    const text = chatDraft.trim();
    if (!text || !activeRoomId) return;
    const roomId = activeRoomId;
    setRooms((rs) => rs.map((r) => (r.id === roomId ? { ...r, messages: [...r.messages, { id: Date.now(), sender: "You", isMe: true, text, time: "Now" }] } : r)));
    setChatDraft("");
    setTimeout(() => {
      setRooms((rs) =>
        rs.map((r) => {
          if (r.id !== roomId) return r;
          const reply = r.replies[Math.floor(Math.random() * r.replies.length)];
          return { ...r, messages: [...r.messages, { id: Date.now() + 1, sender: r.replyName, isMe: false, text: reply, time: "Now" }] };
        })
      );
    }, 1100);
  }

  function handleRegisterGround({ name, sport }) {
    const newGround = {
      id: Date.now(),
      name,
      sport,
      lat: userLocation.lat,
      lon: userLocation.lon,
      verified: false,
    };
    setGroundsList((gs) => [newGround, ...gs]);
    setShowRegisterGround(false);
    setToast(`${name} registered as a ground.`);
  }

  function handleChallenge(player) {
    setToast(`Challenge sent to ${player.name}.`);
    setProfilePlayer(null);
  }

  function handleInvite(player) {
    setToast(`Invite to team sent to ${player.name}.`);
    setProfilePlayer(null);
  }

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  return (
    <div className="min-h-screen w-full bg-stone-200 flex items-start justify-center p-4">
      <div className="w-full max-w-sm bg-stone-50 rounded-3xl shadow-xl border border-stone-300 flex flex-col overflow-hidden" style={{ minHeight: "700px" }}>
        <header className="bg-emerald-950 px-4 py-3 flex items-center gap-1.5 shrink-0">
          <span className="text-stone-50 font-extrabold text-lg tracking-tight uppercase">Matchday</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        </header>

        <div className="border-b border-stone-200 bg-white px-3 py-2 overflow-x-auto shrink-0">
          <div className="flex gap-1.5 w-max">
            <SportChip label="All" color="stone" selected={!selectedSport} onClick={() => setSelectedSport(null)} />
            {SPORTS.map((s) => (
              <SportChip key={s.id} label={s.label} color={s.color} selected={selectedSport === s.id} onClick={() => setSelectedSport(s.id)} />
            ))}
          </div>
        </div>

        <main className="flex-1 min-h-0 flex flex-col overflow-hidden bg-stone-50" style={{ height: "480px" }}>
          {tab === "grounds" && (
            <div className="h-full overflow-y-auto px-3 py-3">
              <GroundsView grounds={allGroundsWithDistance} onRegisterClick={() => setShowRegisterGround(true)} />
            </div>
          )}
          {tab === "feed" && (
            <div className="h-full overflow-y-auto px-3 py-3">
              <FeedView
                posts={visiblePosts}
                onToggleLike={handleToggleLike}
                onOpenProfile={setProfilePlayer}
                getAuthor={getAuthor}
                composerProps={{
                  newPostText, setNewPostText, newPostSport, setNewPostSport,
                  attachLocation, setAttachLocation, postError, onSubmit: handleAddPost,
                }}
              />
            </div>
          )}
          {tab === "discover" && (
            <div className="h-full overflow-y-auto px-3 py-3">
              <DiscoverView
                userLocation={userLocation}
                setUserLocation={setUserLocation}
                radiusKm={radiusKm}
                setRadiusKm={setRadiusKm}
                selectedSport={selectedSport}
                grounds={groundsWithDistance}
                players={playersWithDistance}
                onOpenProfile={setProfilePlayer}
                locStatus={locStatus}
                onUseDeviceLocation={handleUseDeviceLocation}
              />
            </div>
          )}
          {tab === "chat" &&
            (activeRoom ? (
              <ChatThread room={activeRoom} onBack={() => setActiveRoomId(null)} draft={chatDraft} setDraft={setChatDraft} onSend={handleSendChat} />
            ) : (
              <div className="h-full overflow-y-auto px-3 py-3">
                <ChatRoomList rooms={rooms} onOpen={setActiveRoomId} />
              </div>
            ))}
        </main>

        <nav className="border-t border-stone-300 bg-white flex shrink-0">
          {[
            { id: "grounds", label: "Grounds", Icon: Flag },
            { id: "feed", label: "Feed", Icon: Home },
            { id: "discover", label: "Discover", Icon: MapPin },
            { id: "chat", label: "Chat", Icon: MessageCircle },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={"flex-1 flex flex-col items-center gap-0.5 py-2.5 focus:outline-none " + (tab === id ? "text-orange-600" : "text-stone-400")}
            >
              <Icon size={20} />
              <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {profilePlayer && (
        <ProfileModal player={profilePlayer} onClose={() => setProfilePlayer(null)} onChallenge={handleChallenge} onInvite={handleInvite} />
      )}

      {showRegisterGround && (
        <RegisterGroundModal onClose={() => setShowRegisterGround(false)} onSubmit={handleRegisterGround} userLocation={userLocation} />
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-stone-900 text-stone-50 text-sm font-medium px-4 py-2 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
