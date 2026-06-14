const { sendMessage } = require('../services/whatsapp');
const { updateUser } = require('../services/db');

// ─── Main Menu ───────────────────────────────────────────────────────────────
async function menu(from) {
  await updateUser(from, { state: 'knowledge', step: 'main_menu' });
  await sendMessage(from,
    `📚 *HIV Information Centre*\n\n` +
    `What would you like to learn about?\n\n` +
    `1 – What is HIV?\n` +
    `2 – How HIV is transmitted\n` +
    `3 – Prevention methods\n` +
    `4 – HIV treatment (ART)\n` +
    `5 – Living with HIV\n` +
    `6 – Myths & Facts\n` +
    `0 – Back to main menu`
  );
}

// ─── Router ──────────────────────────────────────────────────────────────────
async function handle(from, text, user) {
  const input = text.trim();

  if (user.step === 'main_menu') {
    return handleMainMenu(from, input, user);
  }

  // Sub-menu steps
  if (user.step === 'transmission_menu') return handleTransmission(from, input);
  if (user.step === 'prevention_menu') return handlePrevention(from, input);
  if (user.step === 'art_menu') return handleART(from, input);
  if (user.step === 'living_menu') return handleLiving(from, input);
  if (user.step === 'myths_menu') return handleMyths(from, input);

  // Fallback
  return menu(from);
}

async function handleMainMenu(from, input, user) {
  switch (input) {
    case '1': return sendWhat(from);
    case '2': return transmissionMenu(from);
    case '3': return preventionMenu(from);
    case '4': return artMenu(from);
    case '5': return livingMenu(from);
    case '6': return mythsMenu(from);
    case '0': return exitToMain(from, user);
    default:
      await sendMessage(from, `Please reply with a number from 1–6, or 0 to go back.`);
      return menu(from);
  }
}

// ─── Topic 1: What is HIV ────────────────────────────────────────────────────
async function sendWhat(from) {
  await sendMessage(from,
    `🔬 *What is HIV?*\n\n` +
    `HIV stands for Human Immunodeficiency Virus. It attacks the body's immune system — specifically CD4 cells (T cells) — which help fight infections.\n\n` +
    `If left untreated, HIV can progress to AIDS (Acquired Immunodeficiency Syndrome), where the immune system is too weak to fight off serious illnesses.\n\n` +
    `⚡ *Key facts:*\n` +
    `• HIV is a lifelong condition but it IS manageable\n` +
    `• With treatment, people with HIV live long, healthy lives\n` +
    `• HIV is NOT a death sentence\n\n` +
    `Reply *0* to go back to topics or *00* for main menu.`
  );
  await updateUser(from, { step: 'main_menu' });
}

// ─── Topic 2: Transmission ───────────────────────────────────────────────────
async function transmissionMenu(from) {
  await updateUser(from, { step: 'transmission_menu' });
  await sendMessage(from,
    `🔄 *HIV Transmission*\n\n` +
    `How would you like to learn about this?\n\n` +
    `1 – How HIV IS spread\n` +
    `2 – How HIV is NOT spread\n` +
    `0 – Back to topics`
  );
}

async function handleTransmission(from, input) {
  if (input === '1') {
    await sendMessage(from,
      `✅ *How HIV IS spread:*\n\n` +
      `HIV is transmitted through specific body fluids:\n\n` +
      `• 🩸 Blood\n` +
      `• 💧 Breast milk\n` +
      `• 💉 Sharing needles or syringes\n` +
      `• 🤝 Unprotected sexual contact (vaginal, anal, oral)\n` +
      `• 🤰 Mother to child during pregnancy, birth, or breastfeeding\n\n` +
      `The virus must enter the bloodstream to cause infection.\n\n` +
      `Reply *1* for how it's NOT spread, or *0* to go back.`
    );
  } else if (input === '2') {
    await sendMessage(from,
      `❌ *How HIV is NOT spread:*\n\n` +
      `You CANNOT get HIV from:\n\n` +
      `• 🤗 Hugging or touching someone\n` +
      `• 🍽️ Sharing food, water, or utensils\n` +
      `• 🦟 Mosquito or insect bites\n` +
      `• 😮 Coughing or sneezing\n` +
      `• 🚽 Toilet seats or door handles\n` +
      `• 👁️ Saliva, tears, or sweat\n\n` +
      `HIV does not survive long outside the human body.\n\n` +
      `Reply *0* to go back to topics.`
    );
    await updateUser(from, { step: 'main_menu' });
  } else if (input === '0') {
    return menu(from);
  } else {
    await sendMessage(from, `Please reply 1, 2, or 0.`);
  }
}

// ─── Topic 3: Prevention ─────────────────────────────────────────────────────
async function preventionMenu(from) {
  await updateUser(from, { step: 'prevention_menu' });
  await sendMessage(from,
    `🛡️ *HIV Prevention*\n\n` +
    `Choose a topic:\n\n` +
    `1 – Condoms\n` +
    `2 – PrEP (Pre-Exposure Prophylaxis)\n` +
    `3 – PEP (Post-Exposure Prophylaxis)\n` +
    `4 – Testing & knowing your status\n` +
    `0 – Back to topics`
  );
}

async function handlePrevention(from, input) {
  switch (input) {
    case '1':
      await sendMessage(from,
        `🟢 *Condoms*\n\n` +
        `Male and female condoms are highly effective at preventing HIV when used correctly and consistently.\n\n` +
        `• Use a new condom for every sexual encounter\n` +
        `• Check the expiry date before use\n` +
        `• Use water-based lubricant with condoms\n` +
        `• Condoms also protect against other STIs\n\n` +
        `Reply *0* to go back.`
      );
      await updateUser(from, { step: 'main_menu' });
      break;
    case '2':
      await sendMessage(from,
        `💊 *PrEP (Pre-Exposure Prophylaxis)*\n\n` +
        `PrEP is a daily medication taken by HIV-negative people to prevent getting HIV.\n\n` +
        `• Reduces risk of getting HIV from sex by about 99%\n` +
        `• Must be taken daily to be effective\n` +
        `• Requires a prescription and regular HIV testing\n` +
        `• Available at most HIV treatment centres in Nigeria\n\n` +
        `Talk to your healthcare provider to see if PrEP is right for you.\n\n` +
        `Reply *0* to go back.`
      );
      await updateUser(from, { step: 'main_menu' });
      break;
    case '3':
      await sendMessage(from,
        `🚨 *PEP (Post-Exposure Prophylaxis)*\n\n` +
        `PEP is emergency medication taken AFTER a possible HIV exposure.\n\n` +
        `• Must be started within *72 hours* of exposure\n` +
        `• Taken daily for 28 days\n` +
        `• The sooner you start, the more effective it is\n` +
        `• Available at hospitals and HIV treatment centres\n\n` +
        `⚠️ PEP is for emergencies — it is not a substitute for regular prevention.\n\n` +
        `Reply *0* to go back.`
      );
      await updateUser(from, { step: 'main_menu' });
      break;
    case '4':
      await sendMessage(from,
        `🧪 *HIV Testing*\n\n` +
        `Knowing your status is the first step to staying healthy.\n\n` +
        `• HIV tests are widely available and confidential\n` +
        `• Testing is quick — results in as little as 20 minutes\n` +
        `• You should test regularly if you are sexually active\n` +
        `• Early detection means earlier treatment and better outcomes\n\n` +
        `Testing centres in Nigeria:\n` +
        `• Government hospitals (General Hospitals, Teaching Hospitals)\n` +
        `• PEPFAR-supported clinics\n` +
        `• LSHTM / IDI partner sites\n\n` +
        `Reply *0* to go back.`
      );
      await updateUser(from, { step: 'main_menu' });
      break;
    case '0':
      return menu(from);
    default:
      await sendMessage(from, `Please reply with a number from 1–4, or 0 to go back.`);
  }
}

// ─── Topic 4: ART / Treatment ────────────────────────────────────────────────
async function artMenu(from) {
  await updateUser(from, { step: 'art_menu' });
  await sendMessage(from,
    `💊 *HIV Treatment (ART)*\n\n` +
    `Choose a topic:\n\n` +
    `1 – What is ART?\n` +
    `2 – Why adherence matters\n` +
    `3 – What happens if I miss doses?\n` +
    `4 – Side effects\n` +
    `0 – Back to topics`
  );
}

async function handleART(from, input) {
  switch (input) {
    case '1':
      await sendMessage(from,
        `💊 *What is ART?*\n\n` +
        `ART stands for Antiretroviral Therapy. It is the standard treatment for HIV.\n\n` +
        `• ART works by reducing the amount of virus (viral load) in your body\n` +
        `• It does NOT cure HIV but keeps it under control\n` +
        `• When taken correctly, ART can make the viral load undetectable\n` +
        `• Undetectable = Untransmittable (U=U) — you cannot pass HIV to others\n` +
        `• ART is usually taken as 1–2 pills daily\n\n` +
        `Reply *0* to go back.`
      );
      await updateUser(from, { step: 'main_menu' });
      break;
    case '2':
      await sendMessage(from,
        `⭐ *Why Adherence Matters*\n\n` +
        `Adherence means taking your medication every day, at the same time, as prescribed.\n\n` +
        `• Taking ART consistently keeps your viral load undetectable\n` +
        `• It protects your immune system from damage\n` +
        `• It prevents drug resistance from developing\n` +
        `• People with high adherence live as long as HIV-negative people\n\n` +
        `Even missing a few doses a week can allow the virus to replicate and cause resistance.\n\n` +
        `Reply *0* to go back.`
      );
      await updateUser(from, { step: 'main_menu' });
      break;
    case '3':
      await sendMessage(from,
        `⚠️ *What Happens If I Miss Doses?*\n\n` +
        `Missing doses occasionally happens — here's what to know:\n\n` +
        `• *If you remember the same day:* Take it as soon as you remember\n` +
        `• *If it's almost time for the next dose:* Skip the missed one — never double dose\n` +
        `• *Missing doses regularly:* The virus can multiply and become resistant to your medication\n\n` +
        `If you're struggling to take your medication consistently, talk to your healthcare provider. There may be solutions that can help.\n\n` +
        `Reply *0* to go back.`
      );
      await updateUser(from, { step: 'main_menu' });
      break;
    case '4':
      await sendMessage(from,
        `💡 *ART Side Effects*\n\n` +
        `Most people tolerate ART well. Some may experience:\n\n` +
        `*Short-term (usually go away):*\n` +
        `• Nausea or upset stomach\n` +
        `• Headache\n` +
        `• Fatigue\n` +
        `• Diarrhoea\n\n` +
        `*Long-term (less common):*\n` +
        `• Sleep disturbances\n` +
        `• Changes in body fat distribution\n` +
        `• Kidney or liver changes (monitored by your doctor)\n\n` +
        `⚠️ Never stop taking ART because of side effects without talking to your doctor first. Alternatives are usually available.\n\n` +
        `Reply *0* to go back.`
      );
      await updateUser(from, { step: 'main_menu' });
      break;
    case '0':
      return menu(from);
    default:
      await sendMessage(from, `Please reply with a number from 1–4, or 0 to go back.`);
  }
}

// ─── Topic 5: Living with HIV ────────────────────────────────────────────────
async function livingMenu(from) {
  await updateUser(from, { step: 'living_menu' });
  await sendMessage(from,
    `🌱 *Living with HIV*\n\n` +
    `Choose a topic:\n\n` +
    `1 – Diet & nutrition\n` +
    `2 – Exercise & lifestyle\n` +
    `3 – Mental health & stigma\n` +
    `4 – Relationships & disclosure\n` +
    `0 – Back to topics`
  );
}

async function handleLiving(from, input) {
  switch (input) {
    case '1':
      await sendMessage(from,
        `🥗 *Diet & Nutrition*\n\n` +
        `Good nutrition supports your immune system and helps ART work effectively.\n\n` +
        `• Eat a balanced diet with plenty of fruits, vegetables, and protein\n` +
        `• Stay hydrated — drink enough water daily\n` +
        `• Avoid excessive alcohol — it can interfere with your medication\n` +
        `• Some ART medications work better taken with food\n` +
        `• Talk to your doctor about any supplements\n\n` +
        `Reply *0* to go back.`
      );
      await updateUser(from, { step: 'main_menu' });
      break;
    case '2':
      await sendMessage(from,
        `🏃 *Exercise & Lifestyle*\n\n` +
        `Regular physical activity benefits people living with HIV:\n\n` +
        `• Improves energy levels and mood\n` +
        `• Strengthens the immune system\n` +
        `• Reduces stress and anxiety\n` +
        `• Helps maintain a healthy weight\n\n` +
        `Even 30 minutes of walking most days makes a significant difference. There are no restrictions on exercise for people on ART.\n\n` +
        `Reply *0* to go back.`
      );
      await updateUser(from, { step: 'main_menu' });
      break;
    case '3':
      await sendMessage(from,
        `💙 *Mental Health & Stigma*\n\n` +
        `Living with HIV can affect your mental health. This is normal and you are not alone.\n\n` +
        `• Anxiety, depression, and stress are common — seek support if needed\n` +
        `• HIV-related stigma is a real challenge but it is based on misinformation\n` +
        `• Connecting with support groups can help\n` +
        `• Your healthcare team can refer you to counselling services\n\n` +
        `*Remember:* Having HIV says nothing about your worth as a person. You deserve care, respect, and support.\n\n` +
        `Reply *0* to go back.`
      );
      await updateUser(from, { step: 'main_menu' });
      break;
    case '4':
      await sendMessage(from,
        `❤️ *Relationships & Disclosure*\n\n` +
        `Deciding who to tell about your status is personal.\n\n` +
        `• You are NOT legally required to disclose to everyone\n` +
        `• People with undetectable viral load have effectively zero risk of transmitting HIV sexually (U=U)\n` +
        `• Talking to a counsellor before disclosing can help you prepare\n` +
        `• Healthy relationships and intimacy are absolutely possible\n\n` +
        `If you are in a relationship with an HIV-negative partner, your doctor can discuss PrEP options for them.\n\n` +
        `Reply *0* to go back.`
      );
      await updateUser(from, { step: 'main_menu' });
      break;
    case '0':
      return menu(from);
    default:
      await sendMessage(from, `Please reply with a number from 1–4, or 0 to go back.`);
  }
}

// ─── Topic 6: Myths & Facts ──────────────────────────────────────────────────
async function mythsMenu(from) {
  await updateUser(from, { step: 'myths_menu' });
  await sendMessage(from,
    `🧐 *HIV Myths & Facts*\n\n` +
    `Choose a myth to debunk:\n\n` +
    `1 – "HIV is a death sentence"\n` +
    `2 – "You can tell if someone has HIV by looking at them"\n` +
    `3 – "HIV can be spread by mosquitoes"\n` +
    `4 – "Only certain types of people get HIV"\n` +
    `5 – "If both partners have HIV they don't need condoms"\n` +
    `0 – Back to topics`
  );
}

async function handleMyths(from, input) {
  const myths = {
    '1': `❌ *MYTH: "HIV is a death sentence"*\n\n✅ *FACT:* With modern ART, people living with HIV have a near-normal life expectancy. HIV is a manageable chronic condition — like diabetes or hypertension. Millions of people live full, healthy lives with HIV.`,
    '2': `❌ *MYTH: "You can tell if someone has HIV by looking at them"*\n\n✅ *FACT:* Most people with HIV look and feel completely healthy, especially those on treatment. The only way to know your HIV status is to get tested.`,
    '3': `❌ *MYTH: "HIV can be spread by mosquitoes"*\n\n✅ *FACT:* HIV cannot be transmitted by mosquitoes, insects, or any other animals. The virus does not survive or replicate inside insects. It is only spread through specific human body fluids.`,
    '4': `❌ *MYTH: "Only certain types of people get HIV"*\n\n✅ *FACT:* HIV does not discriminate. Anyone who is exposed to the virus can contract it, regardless of age, gender, sexual orientation, religion, or social status. Stigmatising certain groups creates barriers to testing and treatment.`,
    '5': `❌ *MYTH: "If both partners have HIV they don't need protection"*\n\n✅ *FACT:* Different strains of HIV exist. Reinfection with a different strain can cause drug resistance and make treatment harder. Condoms are still recommended and also protect against other STIs.`
  };

  if (input === '0') return menu(from);

  if (myths[input]) {
    await sendMessage(from, myths[input] + `\n\nReply with another number or *0* to go back to topics.`);
  } else {
    await sendMessage(from, `Please reply with a number from 1–5, or 0 to go back.`);
  }
}

// ─── Exit to Main Menu ───────────────────────────────────────────────────────
async function exitToMain(from, user) {
  await updateUser(from, { state: 'idle', step: null });
  const { sendMessage } = require('../services/whatsapp');
  await sendMessage(from,
    `Main Menu 🏠\n\n` +
    `Reply with:\n` +
    `1 – Log today's medication\n` +
    `2 – Learn about HIV\n` +
    `3 – Update reminder time`
  );
}

module.exports = { menu, handle };